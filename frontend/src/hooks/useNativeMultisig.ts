import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useSendTransaction } from "@luno-kit/react";
import type { TransactionReceipt } from "@luno-kit/react";
import type { Hex } from "viem";

import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssets } from "@/hooks/useHubAssets";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useWorkspaceNativeWallets } from "@/hooks/useWorkspaceNativeWallets";
import {
  accountIdHex,
  addressEquals,
  deriveNativeMultisigAccount,
  getCallHashFromExtrinsicHex,
  sortMultisigMembers,
} from "@/lib/native-multisig";
import {
  normalizeRuntimeCall,
  normalizeWeight,
  summarizeRuntimeCall,
  type RuntimeCallView,
} from "@/lib/runtime-calls";
import type {
  HubAssetBalance,
  ImportedNativeWalletRecord,
  ReviveWeight,
} from "@/types/revive";

const DEFAULT_NATIVE_MULTISIG_WEIGHT: ReviveWeight = {
  proofSize: 250_000n,
  refTime: 3_500_000_000n,
};

const REFRESH_INTERVAL = 30_000;

export interface NativeMultisigOperationView {
  actionSummary: string;
  approvalCount: number;
  approvals: string[];
  blockedReason?: string;
  call?: RuntimeCallView | null;
  callHash: Hex;
  canApprove: boolean;
  canExecute: boolean;
  depositor: string;
  depositHeld: bigint;
  detailConfidence: "reconstructed" | "limited";
  fullCallAvailable: boolean;
  hasApproved: boolean;
  isThresholdMet: boolean;
  maxWeight: ReviveWeight;
  originMethod: "as_multi" | "approve_as_multi" | "unknown";
  signatories: string[];
  threshold: number;
  timepoint: {
    height: number;
    index: number;
  };
  wallet: ImportedNativeWalletRecord;
}

function extractTransactionHash(receipt: TransactionReceipt): Hex | undefined {
  return typeof receipt.transactionHash === "string"
    ? (receipt.transactionHash as Hex)
    : undefined;
}

function accountToString(value: unknown): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    const serialized = JSON.parse(JSON.stringify(value)) as
      | string
      | {
          Id?: string;
          value?: string;
        };

    if (typeof serialized === "string") {
      return serialized;
    }

    if (serialized?.Id) {
      return serialized.Id;
    }

    if (serialized?.value) {
      return serialized.value;
    }
  }

  return null;
}

function buildSupportedRuntimeCall(
  client: NonNullable<ReturnType<typeof usePolkadotClient>["client"]>,
  call: RuntimeCallView
) {
  const pallet = call.pallet.toLowerCase();
  const name = call.palletCall.name.toLowerCase();
  const params = call.palletCall.params ?? {};
  const destination =
    accountToString(params.dest) ??
    accountToString(params.target) ??
    accountToString(params.recipient);

  if (pallet === "balances" && name === "transferkeepalive") {
    if (!destination) {
      throw new Error("Missing balance transfer destination.");
    }

    return client.tx.balances.transferKeepAlive(
      destination,
      BigInt(params.value as bigint | string | number)
    );
  }

  if (pallet === "balances" && name === "transferallowdeath") {
    if (!destination) {
      throw new Error("Missing balance transfer destination.");
    }

    return client.tx.balances.transferAllowDeath(
      destination,
      BigInt(params.value as bigint | string | number)
    );
  }

  if (pallet === "assets" && name === "transferkeepalive") {
    if (!destination) {
      throw new Error("Missing asset transfer destination.");
    }

    return client.tx.assets.transferKeepAlive(
      Number(params.id),
      destination,
      BigInt(params.amount as bigint | string | number)
    );
  }

  if (pallet === "assets" && name === "transfer") {
    if (!destination) {
      throw new Error("Missing asset transfer destination.");
    }

    return client.tx.assets.transfer(
      Number(params.id),
      destination,
      BigInt(params.amount as bigint | string | number)
    );
  }

  throw new Error(
    `ReviveSafe does not support building ${call.pallet}.${call.palletCall.name} in the native wallet flow yet.`
  );
}

async function fetchNativeAssetBalances(
  client: NonNullable<ReturnType<typeof usePolkadotClient>["client"]>,
  wallet: ImportedNativeWalletRecord,
  assets: ReturnType<typeof useHubAssets>["data"]
) {
  const balances = await Promise.all(
    (assets ?? []).map(async (asset) => {
      try {
        const account = await client.query.assets.account(asset.id, wallet.address);

        return {
          ...asset,
          balance: BigInt(account?.balance?.toString?.() ?? 0),
        } satisfies HubAssetBalance;
      } catch {
        return {
          ...asset,
          balance: 0n,
        } satisfies HubAssetBalance;
      }
    })
  );

  return balances;
}

async function fetchOperationSource(
  client: NonNullable<ReturnType<typeof usePolkadotClient>["client"]>,
  height: number,
  index: number
) {
  const blockHash = await client.provider.send("chain_getBlockHash", [height]);
  const body = await client.block.body(blockHash);
  const encodedExtrinsic = body[index] as Hex | undefined;

  if (!encodedExtrinsic) {
    return null;
  }

  const tx = client.toTx(encodedExtrinsic) as {
    call?: {
      pallet?: string;
      palletCall?: {
        name?: string;
        params?: Record<string, unknown>;
      };
    };
    signature?: {
      address?: unknown;
    };
  };

  if (tx.call?.pallet !== "Multisig") {
    return null;
  }

  return {
    encodedExtrinsic,
    signer: accountToString(tx.signature?.address),
    tx,
  };
}

async function fetchNativeMultisigOperations(params: {
  assets: ReturnType<typeof useHubAssets>["data"];
  client: NonNullable<ReturnType<typeof usePolkadotClient>["client"]>;
  currentAccount?: string;
  token: ReturnType<typeof useChainToken>;
  wallets: ImportedNativeWalletRecord[];
}) {
  const { assets, client, currentAccount, token, wallets } = params;
  if (wallets.length === 0) {
    return [];
  }

  const walletEntries = await Promise.all(
    wallets.map(async (wallet) => ({
      entries: (await client.query.multisig.multisigs.entries(wallet.address)) as Array<
        [
          [unknown, Hex],
          {
            approvals: unknown[];
            deposit: bigint | number | string;
            depositor: unknown;
            when: {
              height: number;
              index: number;
            };
          },
        ]
      >,
      wallet,
    }))
  );

  const operations = await Promise.all(
    walletEntries.flatMap(({ entries, wallet }) =>
      entries.map(async ([key, value]) => {
        const source = await fetchOperationSource(
          client,
          Number(value.when.height),
          Number(value.when.index)
        );

        const approvals = value.approvals
          .map(accountToString)
          .filter((entry): entry is string => !!entry);
        const signer =
          source?.signer ??
          accountToString(value.depositor) ??
          wallet.members[0];
        const sourceParams = source?.tx.call?.palletCall?.params ?? {};
        const sourceMethod = source?.tx.call?.palletCall?.name ?? "";
        const derivedSignatories =
          signer && Array.isArray(sourceParams.otherSignatories)
            ? sortMultisigMembers(
                [
                  signer,
                  ...sourceParams.otherSignatories
                    .map(accountToString)
                    .filter((entry): entry is string => !!entry),
                ],
                wallet.ss58Prefix
              ).map((member) => member.address)
            : wallet.members;
        const threshold =
          Number(sourceParams.threshold ?? wallet.threshold) || wallet.threshold;
        const runtimeCall =
          sourceMethod === "AsMulti"
            ? normalizeRuntimeCall(sourceParams.call)
            : null;
        const maxWeight =
          normalizeWeight(sourceParams.maxWeight) ?? DEFAULT_NATIVE_MULTISIG_WEIGHT;
        const hasApproved = currentAccount
          ? approvals.some((approval) => addressEquals(approval, currentAccount))
          : false;
        const isMember = currentAccount
          ? wallet.members.some((member) => addressEquals(member, currentAccount))
          : false;
        const isThresholdMet = approvals.length >= threshold;
        const canApprove = isMember && !hasApproved;
        const canExecute =
          isMember &&
          !!runtimeCall &&
          (isThresholdMet || (!hasApproved && approvals.length + 1 >= threshold));

        return {
          actionSummary: summarizeRuntimeCall({
            assets: assets ?? [],
            call: runtimeCall,
            ss58Prefix: wallet.ss58Prefix,
            token,
          }),
          approvalCount: approvals.length,
          approvals,
          blockedReason:
            runtimeCall || !isThresholdMet
              ? undefined
              : "Full call data is unavailable for this imported proposal.",
          call: runtimeCall,
          callHash: key[1],
          canApprove,
          canExecute,
          depositor: accountToString(value.depositor) ?? wallet.members[0],
          depositHeld: BigInt(value.deposit?.toString?.() ?? 0),
          detailConfidence: runtimeCall ? "reconstructed" : "limited",
          fullCallAvailable: !!runtimeCall,
          hasApproved,
          isThresholdMet,
          maxWeight,
          originMethod:
            sourceMethod === "AsMulti"
              ? "as_multi"
              : sourceMethod === "ApproveAsMulti"
                ? "approve_as_multi"
                : "unknown",
          signatories: derivedSignatories,
          threshold,
          timepoint: {
            height: Number(value.when.height),
            index: Number(value.when.index),
          },
          wallet,
        } satisfies NativeMultisigOperationView;
      })
    )
  );

  return operations
    .flatMap((operation) => (operation ? [operation] : []))
    .sort((left, right) => right.timepoint.height - left.timepoint.height);
}

export function useImportedNativeWallets() {
  const { chain } = usePolkadotClient();
  const wallets = useWorkspaceNativeWallets((state) => state.wallets);

  return useMemo(
    () => wallets.filter((wallet) => wallet.chainKey === chain.key),
    [chain.key, wallets]
  );
}

interface UseNativeMultisigOperationsOptions {
  enabled?: boolean;
  includeAssetMetadata?: boolean;
  refetchInterval?: false | number;
}

export function useNativeMultisigOperations(
  wallets: ImportedNativeWalletRecord[],
  options: UseNativeMultisigOperationsOptions = {}
) {
  const { account } = useAccount();
  const { client, chain } = usePolkadotClient();
  const assetsQuery = useHubAssets({
    enabled:
      (options.enabled ?? true) && (options.includeAssetMetadata ?? true),
  });
  const token = useChainToken();

  return useQuery({
    queryKey: [
      "native-multisig-operations",
      chain.key,
      account?.address ?? "anonymous",
      wallets.map((wallet) => wallet.accountIdHex).join(","),
    ],
    enabled: (options.enabled ?? true) && !!client && wallets.length > 0,
    refetchInterval: options.refetchInterval ?? REFRESH_INTERVAL,
    queryFn: () =>
      fetchNativeMultisigOperations({
        assets: assetsQuery.data,
        client: client as NonNullable<typeof client>,
        currentAccount: account?.address,
        token,
        wallets,
      }),
  });
}

export function useNativeMultisigWallet(wallet?: ImportedNativeWalletRecord) {
  const { client, chain } = usePolkadotClient();
  const assetsQuery = useHubAssets();
  const operationsQuery = useNativeMultisigOperations(wallet ? [wallet] : []);

  const balanceQuery = useQuery({
    queryKey: ["native-wallet-balance", chain.key, wallet?.accountIdHex],
    enabled: !!client && !!wallet,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const account = await client?.query.system.account(wallet?.address ?? "");
      return account ? BigInt(account.data.free.toString()) : 0n;
    },
  });

  const assetBalancesQuery = useQuery({
    queryKey: ["native-wallet-assets", chain.key, wallet?.accountIdHex],
    enabled: !!client && !!wallet && !!assetsQuery.data?.length,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: () =>
      fetchNativeAssetBalances(
        client as NonNullable<typeof client>,
        wallet as ImportedNativeWalletRecord,
        assetsQuery.data
      ),
  });

  return {
    assetBalances: assetBalancesQuery.data ?? [],
    assetBalancesQuery,
    balance: balanceQuery.data,
    balanceQuery,
    isLoading:
      balanceQuery.isLoading ||
      assetBalancesQuery.isLoading ||
      operationsQuery.isLoading,
    loadError:
      (balanceQuery.error instanceof Error && balanceQuery.error.message) ||
      (assetBalancesQuery.error instanceof Error && assetBalancesQuery.error.message) ||
      (operationsQuery.error instanceof Error && operationsQuery.error.message) ||
      undefined,
    operations: operationsQuery.data ?? [],
    operationsQuery,
  };
}

export function useNativeMultisigActions(wallet?: ImportedNativeWalletRecord) {
  const { account } = useAccount();
  const { client } = usePolkadotClient();
  const queryClient = useQueryClient();
  const recordEvent = useWorkspaceNativeWallets((state) => state.recordEvent);
  const { sendTransactionAsync, isPending } = useSendTransaction({
    waitFor: "inBlock",
  });

  const invalidateNativeQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ["native-multisig-operations"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["native-wallet-balance"],
      }),
      queryClient.invalidateQueries({
        queryKey: ["native-wallet-assets"],
      }),
    ]);
  };

  const buildOtherSignatories = () => {
    if (!wallet || !account?.address) {
      throw new Error("Connect a member account before using this wallet.");
    }

    if (!wallet.members.some((member) => addressEquals(member, account.address))) {
      throw new Error("The connected account is not a direct member of this native wallet.");
    }

    return wallet.members
      .filter((member) => !addressEquals(member, account.address))
      .map((member) => member);
  };

  const submitMutation = useMutation({
    mutationKey: ["native-wallet", wallet?.accountIdHex ?? "missing", "submit"],
    mutationFn: async ({
      actionSummary,
      call,
    }: {
      actionSummary: string;
      call: RuntimeCallView;
    }) => {
      if (!client || !wallet) {
        throw new Error("Runtime client is not ready yet.");
      }

      const otherSignatories = buildOtherSignatories();
      const innerExtrinsic = buildSupportedRuntimeCall(client, call);
      const innerCall = innerExtrinsic.call;
      const extrinsic =
        wallet.threshold === 1
          ? client.tx.multisig.asMultiThreshold1(otherSignatories, innerCall)
          : client.tx.multisig.asMulti(
              wallet.threshold,
              otherSignatories,
              undefined,
              innerCall,
              DEFAULT_NATIVE_MULTISIG_WEIGHT
            );
      const encodedInnerCall = innerExtrinsic.toHex() as Hex;
      const receipt = await sendTransactionAsync({ extrinsic });

      if (receipt.status === "failed") {
        throw new Error(
          receipt.errorMessage ?? "Native proposal submission failed on-chain."
        );
      }

      recordEvent({
        chainKey: wallet.chainKey,
        createdAt: Date.now(),
        description: actionSummary,
        extrinsicHash: extractTransactionHash(receipt),
        kind: "proposal_submitted",
        title: "Native proposal submitted",
        walletAccountIdHex: wallet.accountIdHex,
        walletAddress: wallet.address,
      });

      return {
        callHash: getCallHashFromExtrinsicHex(encodedInnerCall),
        receipt,
      };
    },
    onSuccess: invalidateNativeQueries,
  });

  const approveMutation = useMutation({
    mutationKey: ["native-wallet", wallet?.accountIdHex ?? "missing", "approve"],
    mutationFn: async (operation: NativeMultisigOperationView) => {
      if (!client || !wallet) {
        throw new Error("Runtime client is not ready yet.");
      }

      const extrinsic = client.tx.multisig.approveAsMulti(
        operation.threshold,
        buildOtherSignatories(),
        operation.timepoint,
        operation.callHash,
        operation.maxWeight
      );
      const receipt = await sendTransactionAsync({ extrinsic });

      if (receipt.status === "failed") {
        throw new Error(receipt.errorMessage ?? "Native approval failed on-chain.");
      }

      recordEvent({
        chainKey: wallet.chainKey,
        createdAt: Date.now(),
        description: operation.actionSummary,
        extrinsicHash: extractTransactionHash(receipt),
        kind: "proposal_approved",
        title: "Native proposal approved",
        walletAccountIdHex: wallet.accountIdHex,
        walletAddress: wallet.address,
      });

      return receipt;
    },
    onSuccess: invalidateNativeQueries,
  });

  const executeMutation = useMutation({
    mutationKey: ["native-wallet", wallet?.accountIdHex ?? "missing", "execute"],
    mutationFn: async (operation: NativeMultisigOperationView) => {
      if (!client || !wallet) {
        throw new Error("Runtime client is not ready yet.");
      }

      if (!operation.call) {
        throw new Error("Full call data is unavailable for this native proposal.");
      }

      const innerCall = buildSupportedRuntimeCall(client, operation.call).call;
      const extrinsic = client.tx.multisig.asMulti(
        operation.threshold,
        buildOtherSignatories(),
        operation.timepoint,
        innerCall,
        operation.maxWeight
      );
      const receipt = await sendTransactionAsync({ extrinsic });

      if (receipt.status === "failed") {
        throw new Error(receipt.errorMessage ?? "Native execution failed on-chain.");
      }

      recordEvent({
        chainKey: wallet.chainKey,
        createdAt: Date.now(),
        description: operation.actionSummary,
        extrinsicHash: extractTransactionHash(receipt),
        kind: "proposal_executed",
        title: "Native proposal executed",
        walletAccountIdHex: wallet.accountIdHex,
        walletAddress: wallet.address,
      });

      return receipt;
    },
    onSuccess: invalidateNativeQueries,
  });

  const submitNativeTransfer = async (destination: string, amount: bigint) => {
    if (!wallet) {
      throw new Error("Import a native wallet before submitting transfers.");
    }

    return submitMutation.mutateAsync({
      actionSummary: `Send ${amount.toString()} native tokens to ${destination}`,
      call: {
        pallet: "Balances",
        palletCall: {
          name: "TransferKeepAlive",
          params: {
            dest: destination,
            value: amount,
          },
        },
      },
    });
  };

  const submitAssetTransfer = async (
    assetId: number,
    destination: string,
    amount: bigint
  ) => {
    return submitMutation.mutateAsync({
      actionSummary: `Send asset #${assetId} to ${destination}`,
      call: {
        pallet: "Assets",
        palletCall: {
          name: "TransferKeepAlive",
          params: {
            amount,
            id: assetId,
            target: destination,
          },
        },
      },
    });
  };

  return {
    approveOperation: approveMutation.mutateAsync,
    error:
      (submitMutation.error instanceof Error && submitMutation.error.message) ||
      (approveMutation.error instanceof Error && approveMutation.error.message) ||
      (executeMutation.error instanceof Error && executeMutation.error.message) ||
      undefined,
    executeOperation: executeMutation.mutateAsync,
    isSubmitting:
      isPending ||
      submitMutation.isPending ||
      approveMutation.isPending ||
      executeMutation.isPending,
    submitAssetTransfer,
    submitNativeTransfer,
  };
}

export function buildImportedNativeWallet(params: {
  address?: string;
  members: string[];
  name?: string;
  ss58Prefix?: number;
  threshold: number;
  chainKey: ImportedNativeWalletRecord["chainKey"];
}) {
  const members = params.members
    .map((member) => member.trim())
    .filter((member) => member.length > 0);

  if (members.length === 0) {
    throw new Error("Add at least one direct member to import a native wallet.");
  }

  if (!Number.isInteger(params.threshold) || params.threshold <= 0) {
    throw new Error("Threshold must be a whole number greater than zero.");
  }

  if (params.threshold > members.length) {
    throw new Error("Threshold cannot be greater than the member count.");
  }

  const uniqueMembers = new Map<string, string>();
  const dedupedMembers = members.filter((member) => {
    const key = accountIdHex(member).toLowerCase();

    if (uniqueMembers.has(key)) {
      return false;
    }

    uniqueMembers.set(key, member);
    return true;
  });

  if (dedupedMembers.length !== members.length) {
    throw new Error("Each direct member must be unique.");
  }

  const derived = deriveNativeMultisigAccount(
    dedupedMembers,
    params.threshold,
    params.ss58Prefix ?? 0
  );

  if (params.address && !addressEquals(params.address, derived.address)) {
    throw new Error(
      "The provided wallet address does not match this member set and threshold."
    );
  }

  return {
    address: derived.address,
    accountIdHex: derived.accountIdHex,
    chainKey: params.chainKey,
    importedAt: Date.now(),
    members: derived.members,
    memberAccountIds: derived.memberAccountIds,
    name: params.name?.trim() || undefined,
    ss58Prefix: params.ss58Prefix ?? 0,
    threshold: params.threshold,
  } satisfies ImportedNativeWalletRecord;
}

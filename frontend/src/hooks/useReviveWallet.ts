import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Address, type Hex } from "viem";

import { reviveWalletAbi } from "@/config/contracts";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { encodeContractCall, useReviveActions } from "@/hooks/useReviveActions";
import { h160ToFallbackAccountId32 } from "@/lib/account-mapping";

const REFRESH_INTERVAL = 30_000;

export interface WalletTransactionView {
  id: number;
  destination: Address;
  value: bigint;
  data: Hex;
  executed: boolean;
  confirmations: Address[];
  isConfirmed: boolean;
  canConfirm: boolean;
  canExecute: boolean;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;

function queryErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : undefined;
}

export function useReviveWallet(address?: Address, currentOwner?: Address) {
  const adapter = useContractAdapter();
  const { client } = usePolkadotClient();
  const queryClient = useQueryClient();
  const { callContract, isSubmitting, error } = useReviveActions();
  const walletAddress = address ?? ZERO_ADDRESS;
  const actorAddress = currentOwner ?? ZERO_ADDRESS;

  const readTransactionView = async (
    transactionId: bigint
  ): Promise<WalletTransactionView> => {
    const [transaction, confirmations, isConfirmed, canConfirm, canExecute] =
      await Promise.all([
      adapter.read<readonly [Address, bigint, Hex, boolean]>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "getTransaction",
        args: [transactionId],
      }),
      adapter.read<readonly Address[]>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "getConfirmations",
        args: [transactionId],
      }),
      adapter.read<boolean>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "isConfirmed",
        args: [transactionId],
      }),
      currentOwner
        ? adapter.read<boolean>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "canConfirmTransaction",
            args: [transactionId, actorAddress],
          })
        : Promise.resolve(false),
      currentOwner
        ? adapter.read<boolean>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "canExecuteTransaction",
            args: [transactionId, actorAddress],
          })
        : Promise.resolve(false),
    ]);

    return {
      id: Number(transactionId),
      destination: transaction[0],
      value: transaction[1],
      data: transaction[2],
      executed: transaction[3],
      confirmations: [...confirmations],
      isConfirmed,
      canConfirm,
      canExecute,
    } satisfies WalletTransactionView;
  };

  const overviewQuery = useQuery({
    queryKey: ["wallet-overview", walletAddress],
    enabled: !!address,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const [owners, required, transactionCount, pendingCount] = await Promise.all([
          adapter.read<readonly Address[]>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "getOwners",
          }),
          adapter.read<bigint>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "required",
          }),
          adapter.read<bigint>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "transactionCount",
          }),
          adapter.read<bigint>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "getTransactionCount",
            args: [true, false],
          }),
        ]);

      return {
        owners: [...owners],
        required: Number(required),
        transactionCount: Number(transactionCount),
        pendingCount: Number(pendingCount),
      };
    },
  });

  const balanceQuery = useQuery({
    queryKey: ["wallet-native-balance", walletAddress],
    enabled: !!address && !!client,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      if (!client) {
        return 0n;
      }

      const account = await client.query.system.account(
        h160ToFallbackAccountId32(walletAddress)
      );

      return BigInt(account.data.free.toString());
    },
  });

  const pendingTxIdsQuery = useQuery({
    queryKey: ["wallet-pending-ids", walletAddress, overviewQuery.data?.pendingCount],
    enabled: !!address && (overviewQuery.data?.pendingCount ?? 0) > 0,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: () =>
      adapter.read<readonly bigint[]>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "getTransactionIds",
        args: [0n, BigInt(overviewQuery.data?.pendingCount ?? 0), true, false],
      }),
  });

  const pendingTransactionsQuery = useQuery({
    queryKey: [
      "wallet-pending-transactions",
      walletAddress,
      actorAddress,
      pendingTxIdsQuery.data?.join(","),
    ],
    enabled: !!address && (pendingTxIdsQuery.data?.length ?? 0) > 0,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const pendingTransactionIds = pendingTxIdsQuery.data ?? [];

      return Promise.all(pendingTransactionIds.map(readTransactionView));
    },
  });

  const executedCount = Math.max(
    (overviewQuery.data?.transactionCount ?? 0) - (overviewQuery.data?.pendingCount ?? 0),
    0
  );

  const executedTxIdsQuery = useQuery({
    queryKey: ["wallet-executed-ids", walletAddress, executedCount],
    enabled: !!address && executedCount > 0,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: () =>
      adapter.read<readonly bigint[]>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "getTransactionIds",
        args: [BigInt(Math.max(executedCount - 5, 0)), BigInt(executedCount), false, true],
      }),
  });

  const executedTransactionsQuery = useQuery({
    queryKey: [
      "wallet-executed-transactions",
      walletAddress,
      actorAddress,
      executedTxIdsQuery.data?.join(","),
    ],
    enabled: !!address && (executedTxIdsQuery.data?.length ?? 0) > 0,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const executedTransactionIds = [...(executedTxIdsQuery.data ?? [])].reverse();
      return Promise.all(executedTransactionIds.map(readTransactionView));
    },
  });

  const invalidateWalletQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["wallet-overview", walletAddress] }),
      queryClient.invalidateQueries({
        queryKey: ["wallet-native-balance", walletAddress],
      }),
      queryClient.invalidateQueries({
        queryKey: ["wallet-pending-ids", walletAddress],
      }),
      queryClient.invalidateQueries({
        queryKey: ["wallet-pending-transactions", walletAddress],
      }),
      queryClient.invalidateQueries({
        queryKey: ["wallet-executed-ids", walletAddress],
      }),
      queryClient.invalidateQueries({
        queryKey: ["wallet-executed-transactions", walletAddress],
      }),
    ]);
  };

  const submitTransactionMutation = useMutation({
    mutationKey: ["wallet", walletAddress, "submit-transaction"],
    mutationFn: async ({
      destination,
      value,
      data = "0x",
    }: {
      destination: Address;
      value: bigint;
      data?: Hex;
    }) =>
      callContract({
        address: walletAddress,
        data: encodeContractCall({
          abi: reviveWalletAbi,
          functionName: "submitTransaction",
          args: [destination, value, data],
        }),
      }),
    onSuccess: invalidateWalletQueries,
  });

  const submitAssetTransferMutation = useMutation({
    mutationKey: ["wallet", walletAddress, "submit-asset-transfer"],
    mutationFn: async ({
      assetId,
      destination,
      amount,
    }: {
      assetId: number;
      destination: Address;
      amount: bigint;
    }) =>
      callContract({
        address: walletAddress,
        data: encodeContractCall({
          abi: reviveWalletAbi,
          functionName: "submitAssetTransfer",
          args: [assetId, destination, amount],
        }),
      }),
    onSuccess: invalidateWalletQueries,
  });

  const confirmTransactionMutation = useMutation({
    mutationKey: ["wallet", walletAddress, "confirm-transaction"],
    mutationFn: async (transactionId: number) =>
      callContract({
        address: walletAddress,
        data: encodeContractCall({
          abi: reviveWalletAbi,
          functionName: "confirmTransaction",
          args: [BigInt(transactionId)],
        }),
      }),
    onSuccess: invalidateWalletQueries,
  });

  const executeTransactionMutation = useMutation({
    mutationKey: ["wallet", walletAddress, "execute-transaction"],
    mutationFn: async (transactionId: number) =>
      callContract({
        address: walletAddress,
        data: encodeContractCall({
          abi: reviveWalletAbi,
          functionName: "executeTransaction",
          args: [BigInt(transactionId)],
        }),
      }),
    onSuccess: invalidateWalletQueries,
  });

  return {
    owners: overviewQuery.data?.owners,
    required: overviewQuery.data?.required,
    balance: balanceQuery.data,
    transactionCount: overviewQuery.data?.transactionCount,
    pendingCount: overviewQuery.data?.pendingCount ?? 0,
    pendingTxIds: (pendingTxIdsQuery.data ?? []).map((id) => Number(id)),
    pendingTransactions: pendingTransactionsQuery.data ?? [],
    executedTransactions: executedTransactionsQuery.data ?? [],
    isLoading:
      overviewQuery.isLoading ||
      balanceQuery.isLoading ||
      pendingTransactionsQuery.isLoading ||
      executedTransactionsQuery.isLoading,
    loadError:
      queryErrorMessage(overviewQuery.error) ||
      queryErrorMessage(balanceQuery.error) ||
      queryErrorMessage(pendingTxIdsQuery.error) ||
      queryErrorMessage(pendingTransactionsQuery.error) ||
      queryErrorMessage(executedTxIdsQuery.error) ||
      queryErrorMessage(executedTransactionsQuery.error),
    submitTransaction: submitTransactionMutation.mutateAsync,
    submitAssetTransfer: submitAssetTransferMutation.mutateAsync,
    confirmTransaction: confirmTransactionMutation.mutateAsync,
    executeTransaction: executeTransactionMutation.mutateAsync,
    refresh: invalidateWalletQueries,
    isSubmitting:
      isSubmitting ||
      submitTransactionMutation.isPending ||
      submitAssetTransferMutation.isPending ||
      confirmTransactionMutation.isPending ||
      executeTransactionMutation.isPending,
    error:
      (submitTransactionMutation.error instanceof Error &&
        submitTransactionMutation.error.message) ||
      (submitAssetTransferMutation.error instanceof Error &&
        submitAssetTransferMutation.error.message) ||
      (confirmTransactionMutation.error instanceof Error &&
        confirmTransactionMutation.error.message) ||
      (executeTransactionMutation.error instanceof Error &&
        executeTransactionMutation.error.message) ||
      queryErrorMessage(overviewQuery.error) ||
      queryErrorMessage(balanceQuery.error) ||
      queryErrorMessage(pendingTxIdsQuery.error) ||
      queryErrorMessage(pendingTransactionsQuery.error) ||
      queryErrorMessage(executedTxIdsQuery.error) ||
      queryErrorMessage(executedTransactionsQuery.error) ||
      error,
  };
}

export function useReviveWalletOwner(address?: Address, owner?: Address) {
  const adapter = useContractAdapter();
  const walletAddress = address ?? ZERO_ADDRESS;

  return useQuery({
    queryKey: ["wallet-owner-check", walletAddress, owner],
    enabled: !!address && !!owner,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: () =>
      adapter.read<boolean>({
        address: walletAddress,
        abi: reviveWalletAbi,
        functionName: "isOwner",
        args: [owner as Address],
      }),
  });
}

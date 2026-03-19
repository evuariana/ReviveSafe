import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type Address, type Hex } from "viem";

import { reviveWalletAbi } from "@/config/contracts";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { encodeContractCall, useReviveActions } from "@/hooks/useReviveActions";
import { h160ToFallbackAccountId32 } from "@/lib/account-mapping";

const REFRESH_INTERVAL = 5_000;

interface PendingTransactionView {
  id: number;
  destination: Address;
  value: bigint;
  data: Hex;
  executed: boolean;
  confirmations: Address[];
  isConfirmed: boolean;
}

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as Address;

export function useReviveWallet(address?: Address) {
  const adapter = useContractAdapter();
  const { client } = usePolkadotClient();
  const queryClient = useQueryClient();
  const { callContract, isSubmitting, error } = useReviveActions();
  const walletAddress = address ?? ZERO_ADDRESS;

  const overviewQuery = useQuery({
    queryKey: ["wallet-overview", walletAddress],
    enabled: !!address,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const [owners, required, transactionCount, pendingCount] =
        await Promise.all([
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
      pendingTxIdsQuery.data?.join(","),
    ],
    enabled: !!address && (pendingTxIdsQuery.data?.length ?? 0) > 0,
    refetchInterval: REFRESH_INTERVAL,
    queryFn: async () => {
      const pendingTransactionIds = pendingTxIdsQuery.data ?? [];

      return Promise.all(
        pendingTransactionIds.map(async (transactionId) => {
          const [transaction, confirmations, isConfirmed] = await Promise.all([
            adapter.read<readonly [Address, bigint, Hex, boolean]>({
              address: walletAddress,
              abi: reviveWalletAbi,
              functionName: "transactions",
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
          ]);

          return {
            id: Number(transactionId),
            destination: transaction[0],
            value: transaction[1],
            data: transaction[2],
            executed: transaction[3],
            confirmations: [...confirmations],
            isConfirmed,
          } satisfies PendingTransactionView;
        })
      );
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
    ]);
  };

  const submitTransactionMutation = useMutation({
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
    isLoading:
      overviewQuery.isLoading ||
      balanceQuery.isLoading ||
      pendingTransactionsQuery.isLoading,
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

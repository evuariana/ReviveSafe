import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { type Address, type Hex } from "viem";

import { reviveWalletAbi } from "@/config/contracts";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import type { WalletTransactionView } from "@/hooks/useReviveWallet";

interface UseWorkspaceQueuesOptions {
  enabled?: boolean;
  includeRecentActivity?: boolean;
  refetchInterval?: false | number;
}

interface WorkspaceWalletSnapshot {
  address: Address;
  owners: Address[];
  required: number;
  pendingTransactions: WalletTransactionView[];
  executedTransactions: WalletTransactionView[];
}

export interface WorkspaceProposalItem {
  walletAddress: Address;
  owners: Address[];
  required: number;
  transaction: WalletTransactionView;
  needsApproval: boolean;
  readyToExecute: boolean;
}

function queryErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : undefined;
}

export function useWorkspaceQueues(
  walletAddresses: Address[],
  currentOwner?: Address,
  options: UseWorkspaceQueuesOptions = {}
) {
  const adapter = useContractAdapter();
  const enabled = options.enabled ?? true;
  const includeRecentActivity = options.includeRecentActivity ?? true;
  const refetchInterval = options.refetchInterval ?? false;

  const walletQueries = useQueries({
    queries: (enabled ? walletAddresses : []).map((walletAddress) => ({
      queryKey: [
        "workspace-wallet-snapshot",
        walletAddress,
        currentOwner,
        includeRecentActivity ? "with-activity" : "pending-only",
      ],
      enabled: !!walletAddress,
      refetchInterval,
      queryFn: async () => {
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
                    args: [transactionId, currentOwner],
                  })
                : Promise.resolve(false),
              currentOwner
                ? adapter.read<boolean>({
                    address: walletAddress,
                    abi: reviveWalletAbi,
                    functionName: "canExecuteTransaction",
                    args: [transactionId, currentOwner],
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
          };
        };

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
          includeRecentActivity
            ? adapter.read<bigint>({
                address: walletAddress,
                abi: reviveWalletAbi,
                functionName: "transactionCount",
              })
            : Promise.resolve(0n),
          adapter.read<bigint>({
            address: walletAddress,
            abi: reviveWalletAbi,
            functionName: "getTransactionCount",
            args: [true, false],
          }),
        ]);

        const pendingTotal = Number(pendingCount);
        const executedTotal = includeRecentActivity
          ? Math.max(Number(transactionCount) - pendingTotal, 0)
          : 0;

        const [pendingIds, executedIds] = await Promise.all([
          pendingTotal > 0
            ? adapter.read<readonly bigint[]>({
                address: walletAddress,
                abi: reviveWalletAbi,
                functionName: "getTransactionIds",
                args: [0n, BigInt(pendingTotal), true, false],
              })
            : Promise.resolve([] as readonly bigint[]),
          includeRecentActivity && executedTotal > 0
            ? adapter.read<readonly bigint[]>({
                address: walletAddress,
                abi: reviveWalletAbi,
                functionName: "getTransactionIds",
                args: [BigInt(Math.max(executedTotal - 5, 0)), BigInt(executedTotal), false, true],
              })
            : Promise.resolve([] as readonly bigint[]),
        ]);

        const [pendingTransactions, executedTransactions] = await Promise.all([
          Promise.all(pendingIds.map(readTransactionView)),
          Promise.all([...executedIds].reverse().map(readTransactionView)),
        ]);

        return {
          address: walletAddress,
          owners: [...owners],
          required: Number(required),
          pendingTransactions,
          executedTransactions,
        } satisfies WorkspaceWalletSnapshot;
      },
    })),
  });

  return useMemo(() => {
    const snapshots = walletQueries.flatMap((query) => (query.data ? [query.data] : []));

    const proposalItems = snapshots.flatMap((snapshot) =>
      snapshot.pendingTransactions.map(
        (transaction) =>
          ({
            walletAddress: snapshot.address,
            owners: snapshot.owners,
            required: snapshot.required,
            transaction,
            needsApproval: transaction.canConfirm,
            readyToExecute: transaction.canExecute,
          }) satisfies WorkspaceProposalItem
      )
    );

    const recentActivity = snapshots
      .flatMap((snapshot) =>
        snapshot.executedTransactions.map((transaction) => ({
          walletAddress: snapshot.address,
          transaction,
        }))
      )
      .slice(0, 6);

    const firstError = walletQueries.find((query) => query.error)?.error;

    return {
      snapshots,
      needsApproval: proposalItems.filter((proposal) => proposal.needsApproval),
      readyToExecute: proposalItems.filter((proposal) => proposal.readyToExecute),
      recentActivity,
      isLoading: enabled && walletQueries.some((query) => query.isLoading),
      error: queryErrorMessage(firstError),
    };
  }, [enabled, walletQueries]);
}

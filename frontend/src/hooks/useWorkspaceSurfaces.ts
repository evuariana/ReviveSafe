import { useMemo } from "react";

import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useImportedNativeWallets, useNativeMultisigOperations } from "@/hooks/useNativeMultisig";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import {
  type WorkspaceProposalItem,
  useWorkspaceQueues,
} from "@/hooks/useWorkspaceQueues";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { useWorkspaceNativeWallets } from "@/hooks/useWorkspaceNativeWallets";
import { formatTokenBalance } from "@/lib/currency";
import { decodeAssetTransferCall, findHubAssetById } from "@/lib/precompiles";
import { formatAddress } from "@/lib/utils";
import type { ChainTokenInfo, HubAsset } from "@/types/revive";

export interface WorkspaceProposalView {
  actionSummary: string;
  approvalProgress: string;
  detailConfidence: "confirmed" | "reconstructed" | "limited";
  href: string;
  id: string;
  note?: string;
  rail: "native" | "programmable";
  source:
    | {
        rail: "native";
        operationId: string;
      }
    | {
        rail: "programmable";
        transactionId: number;
        walletAddress: string;
      };
  state: "pending_approval" | "ready_to_execute";
  title: string;
  walletAddress: string;
  walletLabel: string;
  walletTypeLabel: string;
  needsAction: boolean;
}

export interface WorkspaceUpdateView {
  chronology: "recorded" | "snapshot";
  createdAt?: number;
  description: string;
  href: string;
  id: string;
  sortOrder?: number;
  title: string;
  walletAddress: string;
  walletLabel: string;
}

export type WorkspaceLifecycleView = WorkspaceUpdateView;

function compareActivityItems(left: WorkspaceUpdateView, right: WorkspaceUpdateView) {
  if (left.chronology !== right.chronology) {
    return left.chronology === "recorded" ? -1 : 1;
  }

  if (left.chronology === "recorded") {
    return (right.createdAt ?? 0) - (left.createdAt ?? 0);
  }

  if ((right.sortOrder ?? 0) !== (left.sortOrder ?? 0)) {
    return (right.sortOrder ?? 0) - (left.sortOrder ?? 0);
  }

  return left.walletLabel.localeCompare(right.walletLabel);
}

function describeProgrammableProposal(
  proposal: WorkspaceProposalItem,
  assets: HubAsset[],
  token: ChainTokenInfo
) {
  const decodedAssetTransfer = decodeAssetTransferCall(
    proposal.transaction.destination,
    proposal.transaction.data
  );

  if (decodedAssetTransfer) {
    const asset = findHubAssetById(assets, decodedAssetTransfer.assetId);
    return `Send ${formatTokenBalance(
      decodedAssetTransfer.amount,
      asset?.decimals ?? 0
    )} ${asset?.symbol || `#${decodedAssetTransfer.assetId}`} to ${formatAddress(
      decodedAssetTransfer.recipient,
      6
    )}`;
  }

  if (proposal.transaction.data !== "0x") {
    if (proposal.transaction.value > 0n) {
      return `Send ${formatTokenBalance(
        proposal.transaction.value,
        token.decimals
      )} ${token.symbol} and execute calldata`;
    }

    return `Contract call to ${formatAddress(proposal.transaction.destination, 6)}`;
  }

  return `Send ${formatTokenBalance(
    proposal.transaction.value,
    token.decimals
  )} ${token.symbol} to ${formatAddress(proposal.transaction.destination, 6)}`;
}

export function useWorkspaceSurfaces() {
  const { chain } = usePolkadotClient();
  const token = useChainToken();
  const assetsQuery = useHubAssets();
  const assets = useMemo(() => assetsQuery.data ?? [], [assetsQuery.data]);
  const { mappedAccount } = useMappedAccount();
  const { myMultisigs } = useReviveFactory();
  const queues = useWorkspaceQueues(myMultisigs, mappedAccount?.mappedH160);
  const nativeWallets = useImportedNativeWallets();
  const nativeOperationsQuery = useNativeMultisigOperations(nativeWallets);
  const nativeWorkspaceEvents = useWorkspaceNativeWallets((state) => state.events);
  const nativeEvents = useMemo(
    () => nativeWorkspaceEvents.filter((event) => event.chainKey === chain.key),
    [chain.key, nativeWorkspaceEvents]
  );

  return useMemo(() => {
    const contractProposals: WorkspaceProposalView[] = queues.snapshots.flatMap((snapshot) =>
      snapshot.pendingTransactions.map(
        (transaction) =>
          ({
            actionSummary: describeProgrammableProposal(
              {
                needsApproval: transaction.canConfirm,
                owners: snapshot.owners,
                readyToExecute: transaction.canExecute,
                required: snapshot.required,
                transaction,
                walletAddress: snapshot.address,
              },
              assets,
              token
            ),
            approvalProgress: `${transaction.confirmations.length}/${snapshot.required}`,
            detailConfidence: "confirmed",
            href: `/wallet/${snapshot.address}#proposal-${transaction.id}`,
            id: `programmable:${snapshot.address}:${transaction.id}`,
            rail: "programmable",
            source: {
              rail: "programmable",
              transactionId: transaction.id,
              walletAddress: snapshot.address,
            },
            state: transaction.isConfirmed ? "ready_to_execute" : "pending_approval",
            title: `Proposal #${transaction.id}`,
            walletAddress: snapshot.address,
            walletLabel: formatAddress(snapshot.address, 6),
            walletTypeLabel: "Programmable",
            needsAction: transaction.canConfirm || transaction.canExecute,
          }) satisfies WorkspaceProposalView
      )
    );

    const nativeProposals: WorkspaceProposalView[] = (nativeOperationsQuery.data ?? []).map(
      (operation) =>
        ({
          actionSummary: operation.actionSummary,
          approvalProgress: `${operation.approvalCount}/${operation.threshold}`,
          detailConfidence: operation.detailConfidence,
          href: `/wallet/${operation.wallet.address}#proposal-${operation.callHash.slice(2, 10)}`,
          id: `native:${operation.wallet.accountIdHex}:${operation.callHash}`,
          note: operation.blockedReason,
          rail: "native",
          source: {
            rail: "native",
            operationId: operation.callHash,
          },
          state: operation.isThresholdMet ? "ready_to_execute" : "pending_approval",
          title: operation.wallet.name || "Imported native proposal",
          walletAddress: operation.wallet.address,
          walletLabel: operation.wallet.name || operation.wallet.address,
          walletTypeLabel: "Native",
          needsAction: operation.canApprove || operation.canExecute,
        }) satisfies WorkspaceProposalView
    );

    const proposals = [...nativeProposals, ...contractProposals].sort((left, right) => {
      if (left.state !== right.state) {
        return left.state === "ready_to_execute" ? -1 : 1;
      }

      if (left.needsAction !== right.needsAction) {
        return left.needsAction ? -1 : 1;
      }

      return left.walletLabel.localeCompare(right.walletLabel);
    });

    const needsAction = proposals.filter((proposal) => proposal.needsAction);
    const programmableUpdates: WorkspaceUpdateView[] = queues.recentActivity.map(
      (entry) => ({
        chronology: "snapshot",
        description: describeProgrammableProposal(
          {
            needsApproval: false,
            owners: [],
            readyToExecute: false,
            required: 0,
            transaction: entry.transaction,
            walletAddress: entry.walletAddress,
          },
          assets,
          token
        ),
        href: `/wallet/${entry.walletAddress}`,
        id: `executed:${entry.walletAddress}:${entry.transaction.id}`,
        sortOrder: entry.transaction.id,
        title: `Executed proposal #${entry.transaction.id}`,
        walletAddress: entry.walletAddress,
        walletLabel: formatAddress(entry.walletAddress, 6),
      })
    );
    const nativeUpdates: WorkspaceUpdateView[] = nativeEvents
      .filter((event) => event.kind !== "wallet_imported")
      .map((event) => ({
        chronology: "recorded",
        createdAt: event.createdAt,
        description: event.description,
        href: `/wallet/${event.walletAddress}`,
        id: event.id,
        sortOrder: event.createdAt,
        title: event.title,
        walletAddress: event.walletAddress,
        walletLabel: formatAddress(event.walletAddress, 6),
      }));
    const lifecycle: WorkspaceLifecycleView[] = nativeEvents
      .filter((event) => event.kind === "wallet_imported")
      .slice(0, 10)
      .map((event) => ({
        chronology: "recorded",
        createdAt: event.createdAt,
        description: event.description,
        href: `/wallet/${event.walletAddress}`,
        id: event.id,
        sortOrder: event.createdAt,
        title: event.title,
        walletAddress: event.walletAddress,
        walletLabel: formatAddress(event.walletAddress, 6),
      }));
    const updates = [...nativeUpdates, ...programmableUpdates].sort(compareActivityItems);
    const activity = [...updates, ...lifecycle].sort(compareActivityItems);

    return {
      activity,
      isLoading:
        queues.isLoading ||
        nativeOperationsQuery.isLoading ||
        assetsQuery.isLoading,
      lifecycle,
      needsAction,
      nativeOperations: nativeOperationsQuery.data ?? [],
      proposals,
      updates,
    };
  }, [
    assets,
    assetsQuery.isLoading,
    nativeEvents,
    nativeOperationsQuery.data,
    nativeOperationsQuery.isLoading,
    queues.isLoading,
    queues.recentActivity,
    queues.snapshots,
    token,
  ]);
}

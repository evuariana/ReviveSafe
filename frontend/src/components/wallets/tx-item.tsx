import { useMemo, useState } from "react";
import { CheckCircle, Clock, Coins, Sparkles } from "lucide-react";
import { formatUnits, type Address, type Hex } from "viem";

import {
  WorkspaceBadge,
  WorkspaceNotice,
  workspaceListItemClassName,
  workspaceOutlineButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { decodeAssetTransferCall, findHubAssetById } from "@/lib/precompiles";
import { formatAddress } from "@/lib/utils";
import type { ChainTokenInfo, HubAsset } from "@/types/revive";

interface TransactionItemProps {
  tx: {
    id: number;
    destination: Address;
    value: bigint;
    data: Hex;
    executed: boolean;
    confirmations: Address[];
    isConfirmed: boolean;
    canConfirm: boolean;
    canExecute: boolean;
  };
  assets: HubAsset[];
  token: ChainTokenInfo;
  onConfirm: (transactionId: number) => Promise<unknown>;
  onExecute: (transactionId: number) => Promise<unknown>;
}

export default function TransactionItem({
  tx,
  assets,
  token,
  onConfirm,
  onExecute,
}: TransactionItemProps) {
  const { client, loading: clientLoading, error: clientError } = usePolkadotClient();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionError, setActionError] = useState<string>();
  const writeUnavailableReason = clientLoading
    ? "Waiting for the selected network."
    : clientError || !client
      ? "ReviveSafe cannot send approvals or execution until the network connection recovers."
      : undefined;

  const decodedAssetTransfer = useMemo(() => {
    const decoded = decodeAssetTransferCall(tx.destination, tx.data);
    if (!decoded) {
      return null;
    }

    return {
      ...decoded,
      asset: findHubAssetById(assets, decoded.assetId),
    };
  }, [assets, tx.data, tx.destination]);

  const displayValue = decodedAssetTransfer
    ? `${formatUnits(
        decodedAssetTransfer.amount,
        decodedAssetTransfer.asset?.decimals ?? 0
      )} ${decodedAssetTransfer.asset?.symbol || `#${decodedAssetTransfer.assetId}`}`
    : `${formatUnits(tx.value, token.decimals)} ${token.symbol}`;

  return (
    <div className={`${workspaceListItemClassName} px-5 py-5`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Proposal #{tx.id}
          </div>
          <div className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
            {displayValue}
          </div>
          <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Recipient {formatAddress(tx.destination, 6)}
          </div>
        </div>

        <div className="space-y-3 sm:text-right">
          {tx.executed ? (
            <WorkspaceBadge tone="emerald">
              <CheckCircle className="h-3.5 w-3.5" />
              Executed
            </WorkspaceBadge>
          ) : tx.isConfirmed ? (
            <WorkspaceBadge tone="sky">
              <Clock className="h-3.5 w-3.5" />
              Ready to execute
            </WorkspaceBadge>
          ) : (
            <WorkspaceBadge tone="amber">
              <Clock className="h-3.5 w-3.5" />
              Awaiting approvals
            </WorkspaceBadge>
          )}
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {tx.confirmations.length} approvals recorded
          </div>
        </div>
      </div>

      {decodedAssetTransfer ? (
        <div className={`mt-4 p-4 ${workspacePanelMutedClassName}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
            <Coins className="h-4 w-4" />
            Asset transfer
          </div>
          <div className="mt-2 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
            Recipient: {formatAddress(decodedAssetTransfer.recipient, 6)} • Asset:{" "}
            {decodedAssetTransfer.assetId}
          </div>
        </div>
      ) : null}

      {tx.data !== "0x" && !decodedAssetTransfer ? (
        <div className={`mt-4 p-4 ${workspacePanelMutedClassName}`}>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
            <Sparkles className="h-4 w-4" />
            Extra call data
          </div>
          <div className="mt-3 break-all font-mono text-xs leading-6 text-zinc-600 dark:text-zinc-400">
            {tx.data}
          </div>
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {actionError ? (
          <WorkspaceNotice tone="rose">{actionError}</WorkspaceNotice>
        ) : null}
        {writeUnavailableReason ? (
          <WorkspaceNotice tone="amber">{writeUnavailableReason}</WorkspaceNotice>
        ) : null}

        <div className="flex flex-wrap gap-2">
          {tx.canConfirm ? (
            <Button
              variant="outline"
              size="sm"
              className={workspaceOutlineButtonClassName}
              disabled={isConfirming || !!writeUnavailableReason}
              onClick={async () => {
                setActionError(undefined);
                setIsConfirming(true);
                try {
                  await onConfirm(tx.id);
                } catch (confirmError) {
                  setActionError(
                    confirmError instanceof Error
                      ? confirmError.message
                      : "Approval failed."
                  );
                } finally {
                  setIsConfirming(false);
                }
              }}
            >
              {isConfirming ? "Approving..." : "Approve"}
            </Button>
          ) : null}

          {tx.canExecute ? (
            <Button
              size="sm"
              className="rounded-full"
              disabled={isExecuting || !!writeUnavailableReason}
              onClick={async () => {
                setActionError(undefined);
                setIsExecuting(true);
                try {
                  await onExecute(tx.id);
                } catch (executeError) {
                  setActionError(
                    executeError instanceof Error
                      ? executeError.message
                      : "Execution failed."
                  );
                } finally {
                  setIsExecuting(false);
                }
              }}
            >
              {isExecuting ? "Executing..." : "Execute"}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

import { useMemo, useState } from "react";
import { CheckCircle, Clock, Coins, Sparkles } from "lucide-react";
import { formatUnits, type Address, type Hex } from "viem";

import { Button } from "@/components/ui/button";
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
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [actionError, setActionError] = useState<string>();

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
    <div className="rounded-[28px] border border-zinc-200 bg-white p-4 shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-950 dark:text-white">
            Proposal #{tx.id}
          </div>
          <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            To {formatAddress(tx.destination, 6)}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-base font-semibold text-zinc-950 dark:text-white">
            {displayValue}
          </div>
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            {tx.confirmations.length} approvals so far
          </div>
        </div>
      </div>

      {decodedAssetTransfer && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <Coins className="h-4 w-4" />
            Asset Hub token transfer
          </div>
          <div className="mt-1 text-xs text-amber-800">
            Recipient: {formatAddress(decodedAssetTransfer.recipient, 6)} | Asset
            ID: {decodedAssetTransfer.assetId}
          </div>
        </div>
      )}

      {tx.data !== "0x" && !decodedAssetTransfer && (
        <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
            <Sparkles className="h-4 w-4" />
            Custom calldata
          </div>
          <div className="mt-2 break-all font-mono text-xs text-zinc-600 dark:text-zinc-400">
            {tx.data}
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {tx.executed ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              <CheckCircle className="h-3.5 w-3.5" />
              Executed
            </div>
          ) : tx.isConfirmed ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-700">
              <Clock className="h-3.5 w-3.5" />
              Ready to execute
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">
              <Clock className="h-3.5 w-3.5" />
              Awaiting approvals
            </div>
          )}
        </div>

        <div className="space-y-2">
          {actionError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
              {actionError}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {tx.canConfirm && (
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                disabled={isConfirming}
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
            )}

            {tx.canExecute && (
              <Button
                size="sm"
                className="rounded-full"
                disabled={isExecuting}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

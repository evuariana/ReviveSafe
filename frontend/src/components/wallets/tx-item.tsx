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
  };
  assets: HubAsset[];
  currentOwner?: Address;
  token: ChainTokenInfo;
  onConfirm: (transactionId: number) => Promise<unknown>;
  onExecute: (transactionId: number) => Promise<unknown>;
}

export default function TransactionItem({
  tx,
  assets,
  currentOwner,
  token,
  onConfirm,
  onExecute,
}: TransactionItemProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

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

  const hasConfirmed = tx.confirmations.some(
    (confirmation) => confirmation.toLowerCase() === currentOwner?.toLowerCase()
  );

  const displayValue = decodedAssetTransfer
    ? `${formatUnits(
        decodedAssetTransfer.amount,
        decodedAssetTransfer.asset?.decimals ?? 0
      )} ${decodedAssetTransfer.asset?.symbol || `#${decodedAssetTransfer.assetId}`}`
    : `${formatUnits(tx.value, token.decimals)} ${token.symbol}`;

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-950">
            Transaction #{tx.id}
          </div>
          <div className="mt-1 text-sm text-slate-500">
            To {formatAddress(tx.destination, 6)}
          </div>
        </div>
        <div className="text-left sm:text-right">
          <div className="text-base font-semibold text-slate-950">{displayValue}</div>
          <div className="text-xs text-slate-500">
            {tx.confirmations.length} confirmations
          </div>
        </div>
      </div>

      {decodedAssetTransfer && (
        <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">
          <div className="flex items-center gap-2 font-semibold">
            <Coins className="h-4 w-4" />
            Asset precompile transfer
          </div>
          <div className="mt-1 text-xs text-amber-800">
            Recipient: {formatAddress(decodedAssetTransfer.recipient, 6)} | Asset
            ID: {decodedAssetTransfer.assetId}
          </div>
        </div>
      )}

      {tx.data !== "0x" && !decodedAssetTransfer && (
        <div className="mt-4 rounded-2xl bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Sparkles className="h-4 w-4" />
            Call data
          </div>
          <div className="mt-2 break-all font-mono text-xs text-slate-600">
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
              Pending approvals
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {!hasConfirmed && !tx.executed && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={isConfirming}
              onClick={async () => {
                setIsConfirming(true);
                try {
                  await onConfirm(tx.id);
                } finally {
                  setIsConfirming(false);
                }
              }}
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </Button>
          )}

          {tx.isConfirmed && !tx.executed && (
            <Button
              size="sm"
              className="rounded-xl"
              disabled={isExecuting}
              onClick={async () => {
                setIsExecuting(true);
                try {
                  await onExecute(tx.id);
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
  );
}

// src/components/wallets/tx-item.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Coins, Sparkles } from "lucide-react";
import { useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatAddress, formatBalance } from "@/lib/utils";
import { getCurrentChainSymbol } from "@/lib/currency";
import { decodeAssetTransferCall } from "@/lib/precompiles";
import { Address, Hex, formatUnits } from "viem";

interface TransactionItemProps {
  txId: number;
  walletAddress: Address;
  userAddress?: Address;
  onTransactionUpdate?: () => void; // Callback to trigger parent refresh
}

export default function TransactionItem({
  txId,
  walletAddress,
  userAddress,
  onTransactionUpdate,
}: TransactionItemProps) {
  const {
    useTransaction,
    useTransactionConfirmations,
    useIsTransactionConfirmed,
    confirmTransaction,
    executeTransaction,
  } = useReviveWallet(walletAddress);

  const { data: transaction, refetch: refetchTransaction } =
    useTransaction(txId);
  const { data: confirmations, refetch: refetchConfirmations } =
    useTransactionConfirmations(txId);
  const { data: isConfirmed, refetch: refetchIsConfirmed } =
    useIsTransactionConfirmed(txId);

  const [isConfirming, setIsConfirming] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const chainId = useChainId();

  if (!transaction) {
    return <div className="animate-pulse h-24 bg-gray-200 rounded"></div>;
  }

  const hasUserConfirmed = confirmations?.some(
    (addr) => addr.toLowerCase() === userAddress?.toLowerCase()
  );

  const tx = transaction as readonly [Address, bigint, Hex, boolean];
  const isExecuted = tx[3];
  const decodedAssetTransfer = decodeAssetTransferCall(tx[0], tx[2]);
  const displayValue = decodedAssetTransfer
    ? `${formatUnits(
        decodedAssetTransfer.amount,
        decodedAssetTransfer.asset?.decimals ?? 0
      )} ${decodedAssetTransfer.asset?.symbol || `Asset #${decodedAssetTransfer.assetId}`}`
    : `${formatBalance(tx[1])} ${getCurrentChainSymbol(chainId)}`;

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await confirmTransaction(txId);

      setTimeout(async () => {
        await Promise.all([
          refetchTransaction(),
          refetchConfirmations(),
          refetchIsConfirmed(),
        ]);
        onTransactionUpdate?.();
        setIsConfirming(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to confirm transaction:", error);
      setIsConfirming(false);
    }
  };

  const handleExecute = async () => {
    try {
      setIsExecuting(true);
      await executeTransaction(txId);

      setTimeout(async () => {
        await Promise.all([
          refetchTransaction(),
          refetchConfirmations(),
          refetchIsConfirmed(),
        ]);
        onTransactionUpdate?.();
        setIsExecuting(false);
      }, 1500);
    } catch (error) {
      console.error("Failed to execute transaction:", error);
      setIsExecuting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-4 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-medium">Transaction #{txId}</h4>
          <p className="text-sm text-gray-600">
            To: {formatAddress(tx[0] as Address)}
          </p>
        </div>
        <div className="text-right">
          <div className="font-semibold">
            {displayValue}
          </div>
          <div className="text-sm text-gray-600">
            {confirmations?.length || 0} confirmations
          </div>
        </div>
      </div>

      {decodedAssetTransfer && (
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
          <div className="flex items-center gap-2 font-medium">
            <Coins className="h-4 w-4" />
            Asset precompile transfer
          </div>
          <div className="mt-1 text-xs text-blue-700">
            Recipient: {formatAddress(decodedAssetTransfer.recipient)} | Asset ID:{" "}
            {decodedAssetTransfer.assetId}
          </div>
        </div>
      )}

      {tx[2] && tx[2] !== "0x" && !decodedAssetTransfer && (
        <div className="text-sm">
          <span className="font-medium flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            Call data
          </span>
          <div className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
            {tx[2] as string}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isExecuted ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Executed</span>
            </div>
          ) : isConfirmed ? (
            <div className="flex items-center gap-1 text-blue-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Ready to Execute</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Pending</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!hasUserConfirmed && !isExecuted && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleConfirm}
              disabled={isConfirming}
            >
              {isConfirming ? "Confirming..." : "Confirm"}
            </Button>
          )}

          {isConfirmed && !isExecuted && (
            <Button size="sm" onClick={handleExecute} disabled={isExecuting}>
              {isExecuting ? "Executing..." : "Execute"}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

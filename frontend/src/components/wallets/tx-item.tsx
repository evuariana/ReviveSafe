// src/components/wallets/tx-item.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatAddress, formatBalance } from "@/lib/utils";
import { Address } from "viem";

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

  if (!transaction) {
    return <div className="animate-pulse h-24 bg-gray-200 rounded"></div>;
  }

  const hasUserConfirmed = confirmations?.some(
    (addr) => addr.toLowerCase() === userAddress?.toLowerCase()
  );

  const isExecuted = transaction[3] as boolean;

  console.log("Transaction data:", transaction);

  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await confirmTransaction(txId);

      // Wait a moment for blockchain to update, then refetch
      setTimeout(async () => {
        await Promise.all([
          refetchTransaction(),
          refetchConfirmations(),
          refetchIsConfirmed(),
        ]);
        onTransactionUpdate?.(); // Trigger parent component refresh
        setIsConfirming(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to confirm transaction:", error);
      setIsConfirming(false);
    }
  };

  const handleExecute = async () => {
    try {
      setIsExecuting(true);
      await executeTransaction(txId);

      // Wait a moment for blockchain to update, then refetch
      setTimeout(async () => {
        await Promise.all([
          refetchTransaction(),
          refetchConfirmations(),
          refetchIsConfirmed(),
        ]);
        onTransactionUpdate?.(); // Trigger parent component refresh
        setIsExecuting(false);
      }, 2000);
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
            To: {formatAddress(transaction[0] as Address)}
          </p>
        </div>
        <div className="text-right">
          <div className="font-semibold">
            {formatBalance(transaction[1] as bigint)} WND
          </div>
          <div className="text-sm text-gray-600">
            {confirmations?.length || 0} confirmations
          </div>
        </div>
      </div>

      {transaction[2] && transaction[2] !== "0x" && (
        <div className="text-sm">
          <span className="font-medium">Data:</span>
          <div className="font-mono text-xs bg-gray-100 p-2 rounded truncate">
            {transaction[2] as string}
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

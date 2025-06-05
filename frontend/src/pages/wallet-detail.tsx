import { useParams, Link } from "react-router-dom";
import { useAccount, useBalance, useChainId } from "wagmi";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Copy,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatBalance } from "@/lib/utils";
import { Address } from "viem";

import OwnersList from "@/components/wallets/owner-info";
import TransactionItem from "@/components/wallets/tx-item";
import NewTransactionForm from "@/components/wallets/tx-form";
import { useCallback, useState } from "react";
import { getCurrentChainSymbol } from "@/lib/currency";

export default function WalletDetail() {
  const { address: walletAddress } = useParams<{ address: string }>();
  const { address: userAddress } = useAccount();

  const chainId = useChainId();
  const chainSymbol = getCurrentChainSymbol(chainId);
  const [refreshKey, setRefreshKey] = useState(0);

  const {
    owners,
    required,
    balance,
    transactionCount,
    pendingCount,
    pendingTxIds,
    contractData,
    useIsOwner,
  } = useReviveWallet(walletAddress as Address);

  const { data: isOwner } = useIsOwner(userAddress);
  // Get user's balance (not multisig balance)
  const { data: userBalance } = useBalance({ address: userAddress });

  const handleTransactionUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
    // Force a small delay and refresh the page data
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  }, []);

  if (!walletAddress) {
    return <div>Invalid wallet address</div>;
  }

  return (
    <motion.div
      key={refreshKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Multisig Wallet</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600 font-mono text-sm">{walletAddress}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigator.clipboard.writeText(walletAddress)}
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {userBalance ? formatBalance(userBalance.value) : "0.00"}{" "}
              {chainSymbol}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionCount || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingCount || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Access Control Warning */}
      {!isOwner && userAddress && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">Read-only access</span>
            </div>
            <p className="text-sm text-orange-600 mt-1">
              You are not an owner of this multisig wallet. You can view but
              cannot perform transactions.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Owners List Component */}
        <OwnersList
          owners={owners}
          required={required}
          userAddress={userAddress}
        />

        {/* New Transaction Form Component (only for owners) */}
        {isOwner && (
          <NewTransactionForm
            walletAddress={walletAddress as Address}
            onTransactionSubmitted={handleTransactionUpdate}
          />
        )}
      </div>

      {/* Pending Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Pending Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!pendingTxIds || pendingTxIds.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No pending transactions</p>
              <p className="text-sm">All transactions have been executed</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingTxIds.map((txId) => (
                <TransactionItem
                  key={txId}
                  txId={txId}
                  walletAddress={walletAddress as Address}
                  userAddress={userAddress}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

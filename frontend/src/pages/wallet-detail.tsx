import { useParams, Link } from "react-router-dom";
import { useAccount, useChainId } from "wagmi";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Copy,
  Coins,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatBalance } from "@/lib/utils";
import { Address, formatUnits } from "viem";

import OwnersList from "@/components/wallets/owner-info";
import TransactionItem from "@/components/wallets/tx-item";
import NewTransactionForm from "@/components/wallets/tx-form";
import { useCallback, useState } from "react";
import { getCurrentChainSymbol } from "@/lib/currency";
import { useHubAssetBalances } from "@/hooks/useHubAssetBalances";
import { POLKADOT_HUB_TESTNET } from "@/config/constants";

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
    useIsOwner,
  } = useReviveWallet(walletAddress as Address);
  const { balances: assetBalances } = useHubAssetBalances(
    walletAddress as Address
  );

  const { data: isOwner } = useIsOwner(userAddress);

  const handleTransactionUpdate = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
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
        <Link to="/wallets">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
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
            <a
              href={`${POLKADOT_HUB_TESTNET.explorerUrl}/address/${walletAddress}`}
              target="_blank"
              rel="noreferrer"
            >
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {balance ? formatBalance(balance.value) : "0.00"}{" "}
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Precompile Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {assetBalances.filter((asset) => asset.balance > 0n).length}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Owners List Component */}
        <OwnersList
          owners={owners}
          required={required}
          userAddress={userAddress}
        />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coins className="h-5 w-5" />
              Asset Balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetBalances.length === 0 ? (
              <p className="text-sm text-gray-500">
                Loading asset metadata from Dedot.
              </p>
            ) : (
              assetBalances.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-lg border border-gray-200 p-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{asset.name}</div>
                      <div className="text-xs text-gray-500">
                        #{asset.id} • {asset.precompileAddress}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatUnits(asset.balance, asset.decimals)}{" "}
                        {asset.symbol}
                      </div>
                      <div className="text-xs text-gray-500">
                        ERC-20 precompile
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

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
                  onTransactionUpdate={handleTransactionUpdate}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

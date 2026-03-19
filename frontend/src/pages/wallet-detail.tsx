import { Link, useParams } from "react-router-dom";
import { Copy, ExternalLink, Wallet2 } from "lucide-react";
import { formatUnits, isAddress, type Address } from "viem";

import OwnersInfo from "@/components/wallets/owner-info";
import NewTransactionForm from "@/components/wallets/tx-form";
import TransactionItem from "@/components/wallets/tx-item";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssetBalances } from "@/hooks/useHubAssetBalances";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveWallet, useReviveWalletOwner } from "@/hooks/useReviveWallet";
import { formatTokenBalance } from "@/lib/currency";

export default function WalletDetail() {
  const { address } = useParams<{ address: string }>();
  const { chain } = usePolkadotClient();
  const token = useChainToken();
  const { mappedAccount } = useMappedAccount();
  const walletAddress = isAddress(address ?? "") ? (address as Address) : undefined;
  const wallet = useReviveWallet(walletAddress);
  const { balances: assetBalances } = useHubAssetBalances(walletAddress);
  const { data: assets = [] } = useHubAssets();
  const ownerQuery = useReviveWalletOwner(walletAddress, mappedAccount?.mappedH160);

  if (!walletAddress) {
    return <div className="text-sm text-rose-600">Invalid wallet address.</div>;
  }
  const visibleAssetBalances = assetBalances.filter((asset) => asset.balance > 0n);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Link to="/wallets">
            <Button variant="outline" className="rounded-xl">
              Back to wallets
            </Button>
          </Link>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
              Wallet detail
            </div>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
              Revive multisig
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
              <span className="font-mono">{walletAddress}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(walletAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <a href={`${chain.explorerUrl}/account/${walletAddress}`} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {ownerQuery.data
            ? "You can submit and approve proposals from this wallet."
            : "You have read-only access unless your mapped H160 is an owner."}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Native balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-950">
              {formatTokenBalance(wallet.balance ?? 0n, token.decimals)} {token.symbol}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-950">
              {wallet.transactionCount ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-950">
              {wallet.pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Asset precompiles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-950">
              {visibleAssetBalances.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr,1.05fr]">
        <OwnersInfo
          owners={wallet.owners}
          required={wallet.required}
          userAddress={mappedAccount?.mappedH160}
        />

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet2 className="h-5 w-5" />
              Precompile balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleAssetBalances.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                No balances detected in the currently loaded asset-precompile set.
              </div>
            ) : (
              visibleAssetBalances.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {asset.symbol || asset.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {asset.name} • #{asset.id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-900">
                        {formatUnits(asset.balance, asset.decimals)} {asset.symbol}
                      </div>
                      <div className="font-mono text-[11px] text-slate-500">
                        {asset.precompileAddress}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {ownerQuery.data && (
        <NewTransactionForm walletAddress={walletAddress} onTransactionSubmitted={wallet.refresh} />
      )}

      <Card className="rounded-[24px] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Pending transactions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallet.pendingTransactions.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-500">
              No pending transactions right now.
            </div>
          ) : (
            wallet.pendingTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                tx={transaction}
                assets={assets}
                currentOwner={mappedAccount?.mappedH160}
                token={token}
                onConfirm={wallet.confirmTransaction}
                onExecute={wallet.executeTransaction}
              />
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

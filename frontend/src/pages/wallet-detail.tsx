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
            <Button
              variant="outline"
              className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
            >
              Back to wallets
            </Button>
          </Link>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
              Wallet detail
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Wallet overview
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
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

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
          {ownerQuery.data
            ? "You are an owner on this wallet. You can create, approve, and execute proposals here."
            : "You are viewing this wallet in read-only mode. Only owners can create or approve proposals."}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Native balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {formatTokenBalance(wallet.balance ?? 0n, token.decimals)} {token.symbol}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Total proposals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {wallet.transactionCount ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Pending actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {wallet.pendingCount}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Asset balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {visibleAssetBalances.length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OwnersInfo
          owners={wallet.owners}
          required={wallet.required}
          userAddress={mappedAccount?.mappedH160}
        />

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-950 dark:text-white">
              <Wallet2 className="h-5 w-5" />
              Asset balances
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {visibleAssetBalances.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                No supported asset balances were detected for this wallet yet.
              </div>
            ) : (
              visibleAssetBalances.map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-zinc-200 p-3 dark:border-white/10"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                        {asset.symbol || asset.name}
                      </div>
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        {asset.name} • #{asset.id}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                        {formatUnits(asset.balance, asset.decimals)} {asset.symbol}
                      </div>
                      <div className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400">
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

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader>
          <CardTitle className="text-zinc-950 dark:text-white">Proposal queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {wallet.pendingTransactions.length === 0 ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              No proposals are waiting right now.
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

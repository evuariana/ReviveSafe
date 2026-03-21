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
  const { chain, error: clientError, loading: clientLoading } = usePolkadotClient();
  const token = useChainToken();
  const { mappedAccount } = useMappedAccount();
  const walletAddress = isAddress(address ?? "") ? (address as Address) : undefined;
  const wallet = useReviveWallet(walletAddress, mappedAccount?.mappedH160);
  const assetBalancesQuery = useHubAssetBalances(walletAddress);
  const assetsQuery = useHubAssets();
  const assets = assetsQuery.data ?? [];
  const assetBalances = assetBalancesQuery.balances;
  const ownerQuery = useReviveWalletOwner(walletAddress, mappedAccount?.mappedH160);

  if (!walletAddress) {
    return <div className="text-sm text-rose-600">Invalid wallet address.</div>;
  }

  if (wallet.isLoading && !wallet.owners && !wallet.loadError) {
    return (
      <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
        Loading wallet state from the active network...
      </div>
    );
  }

  if (wallet.loadError && !wallet.owners) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {wallet.loadError}
      </div>
    );
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
              Programmable wallet overview
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
          {ownerQuery.isLoading
            ? "Checking whether this account can act on this wallet."
            : ownerQuery.data
            ? "You are an owner on this wallet. You can create, approve, and execute proposals here."
            : "You are viewing this wallet in read-only mode. Only owners can create, approve, or execute proposals."}
        </div>
      </div>

      {wallet.loadError && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Some wallet data could not be refreshed from the active network.
          ReviveSafe is showing the last successful reads where available.
          <div className="mt-2">{wallet.loadError}</div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Native balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-zinc-950 dark:text-white">
              {clientError && !clientLoading
                ? "Unavailable"
                : wallet.balance === undefined
                ? "Loading..."
                : `${formatTokenBalance(wallet.balance, token.decimals)} ${token.symbol}`}
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
              {wallet.transactionCount ?? "—"}
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
              {clientError && !clientLoading
                ? "Unavailable"
                : assetBalancesQuery.isLoading || assetsQuery.isLoading
                ? "Loading..."
                : visibleAssetBalances.length}
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
            {clientError && !clientLoading ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Asset balances are unavailable until ReviveSafe reconnects to
                the active runtime.
              </div>
            ) : assetBalancesQuery.error || assetsQuery.error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Failed to load wallet asset balances from the active network.
              </div>
            ) : assetBalancesQuery.isLoading || assetsQuery.isLoading ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                Loading supported asset balances...
              </div>
            ) : visibleAssetBalances.length === 0 ? (
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

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-zinc-950 dark:text-white">Proposal queue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet.isLoading && wallet.pendingTransactions.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                Loading pending proposals...
              </div>
            ) : wallet.loadError && wallet.pendingTransactions.length === 0 ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
                Failed to load the current proposal queue.
              </div>
            ) : wallet.pendingTransactions.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                No proposals are waiting right now.
              </div>
            ) : (
              wallet.pendingTransactions.map((transaction) => (
                <TransactionItem
                  key={transaction.id}
                  tx={transaction}
                  assets={assets}
                  token={token}
                  onConfirm={wallet.confirmTransaction}
                  onExecute={wallet.executeTransaction}
                />
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-zinc-950 dark:text-white">Recent activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {wallet.isLoading && wallet.executedTransactions.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                Loading executed proposals...
              </div>
            ) : wallet.executedTransactions.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                No executed proposals have been detected for this wallet yet.
              </div>
            ) : (
              wallet.executedTransactions.map((transaction) => (
                <TransactionItem
                  key={`executed-${transaction.id}`}
                  tx={transaction}
                  assets={assets}
                  token={token}
                  onConfirm={wallet.confirmTransaction}
                  onExecute={wallet.executeTransaction}
                />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Link, useParams } from "react-router-dom";
import { Copy, ExternalLink, Wallet2 } from "lucide-react";
import { formatUnits, isAddress, type Address } from "viem";

import OwnersInfo from "@/components/wallets/owner-info";
import NewTransactionForm from "@/components/wallets/tx-form";
import TransactionItem from "@/components/wallets/tx-item";
import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceNotice,
  WorkspacePanel,
  WorkspaceStatCard,
  workspaceGhostButtonClassName,
  workspaceOutlineButtonClassName,
  workspacePageClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { NativeWalletDetail } from "@/pages/native-wallet-detail";
import { Button } from "@/components/ui/button";
import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssetBalances } from "@/hooks/useHubAssetBalances";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useImportedNativeWallets } from "@/hooks/useNativeMultisig";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveWallet, useReviveWalletOwner } from "@/hooks/useReviveWallet";
import { formatTokenBalance } from "@/lib/currency";
import { addressEquals } from "@/lib/native-multisig";

export default function WalletDetail() {
  const { address } = useParams<{ address: string }>();
  const { chain, error: clientError, loading: clientLoading } = usePolkadotClient();
  const token = useChainToken();
  const { mappedAccount } = useMappedAccount();
  const importedNativeWallets = useImportedNativeWallets();
  const importedNativeWallet = importedNativeWallets.find((wallet) =>
    address ? addressEquals(wallet.address, address) : false
  );
  const walletAddress = isAddress(address ?? "") ? (address as Address) : undefined;
  const wallet = useReviveWallet(walletAddress, mappedAccount?.mappedH160);
  const assetBalancesQuery = useHubAssetBalances(walletAddress);
  const assetsQuery = useHubAssets();
  const assets = assetsQuery.data ?? [];
  const assetBalances = assetBalancesQuery.balances;
  const ownerQuery = useReviveWalletOwner(walletAddress, mappedAccount?.mappedH160);

  if (importedNativeWallet && !walletAddress) {
    return <NativeWalletDetail wallet={importedNativeWallet} />;
  }

  if (!walletAddress) {
    return <WorkspaceNotice tone="rose">Invalid wallet address.</WorkspaceNotice>;
  }

  if (wallet.isLoading && !wallet.owners && !wallet.loadError) {
    return (
      <WorkspaceNotice>
        Loading wallet state from the active network...
      </WorkspaceNotice>
    );
  }

  if (wallet.loadError && !wallet.owners) {
    return <WorkspaceNotice tone="rose">{wallet.loadError}</WorkspaceNotice>;
  }

  const visibleAssetBalances = assetBalances.filter((asset) => asset.balance > 0n);

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Contract wallet"
        title="Contract wallet"
        description={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-mono">{walletAddress}</span>
              <Button
                variant="ghost"
                size="sm"
                className={workspaceGhostButtonClassName}
                onClick={() => navigator.clipboard.writeText(walletAddress)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <a href={`${chain.explorerUrl}/account/${walletAddress}`} target="_blank" rel="noreferrer">
                <Button variant="ghost" size="sm" className={workspaceGhostButtonClassName}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <p className="text-base font-light leading-8 text-zinc-600 dark:text-zinc-400">
              Review balances, owners, open proposals, and recent changes for
              this contract wallet.
            </p>
          </div>
        }
        actions={
          <Link to="/wallets">
            <Button
              variant="outline"
              className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
            >
              Back to wallets
            </Button>
          </Link>
        }
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={ownerQuery.data ? "emerald" : "default"}>
              {ownerQuery.isLoading
                ? "Checking access"
                : ownerQuery.data
                  ? "Owner access"
                  : "Read-only view"}
            </WorkspaceBadge>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {ownerQuery.isLoading
                ? "Checking whether this account can act on this wallet."
                : ownerQuery.data
                  ? "You are an owner on this wallet. You can create, approve, and execute proposals here."
                  : "You are viewing this wallet in read-only mode. Only owners can create, approve, or execute proposals here."}
            </p>
          </div>
        }
      />

      {wallet.loadError ? (
        <WorkspaceNotice tone="amber">
          Some wallet data could not be refreshed from the active network.
          ReviveSafe is showing the last successful reads where available.
          <div className="mt-2">{wallet.loadError}</div>
        </WorkspaceNotice>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkspaceStatCard
          label="Native balance"
          value={
            clientError && !clientLoading
              ? "Unavailable"
              : wallet.balance === undefined
                ? "Loading..."
                : `${formatTokenBalance(wallet.balance, token.decimals)} ${token.symbol}`
          }
          description="Chain token balance currently held by this wallet."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Total proposals"
          value={wallet.transactionCount ?? "—"}
          description="Total proposals recorded for this wallet."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Pending actions"
          value={wallet.pendingCount}
          description="Proposals still waiting for more approvals or execution."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Asset balances"
          value={
            clientError && !clientLoading
              ? "Unavailable"
              : assetBalancesQuery.isLoading || assetsQuery.isLoading
                ? "Loading..."
                : visibleAssetBalances.length
          }
          description="Supported Asset Hub balances detected for this wallet."
          icon={Wallet2}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OwnersInfo
          description="These are the owners who can approve and execute work on this wallet."
          owners={wallet.owners}
          required={wallet.required}
          title="Owners"
          userAddress={mappedAccount?.mappedH160}
        />

        <WorkspacePanel
          title={
            <span className="flex items-center gap-2">
              <Wallet2 className="h-5 w-5" />
              Asset balances
            </span>
          }
          contentClassName="space-y-3"
        >
          {clientError && !clientLoading ? (
            <WorkspaceNotice tone="rose">
              Asset balances are unavailable until ReviveSafe reconnects to the selected network.
            </WorkspaceNotice>
          ) : assetBalancesQuery.error || assetsQuery.error ? (
            <WorkspaceNotice tone="rose">
              Failed to load wallet asset balances from the selected network.
            </WorkspaceNotice>
          ) : assetBalancesQuery.isLoading || assetsQuery.isLoading ? (
            <WorkspaceNotice>Loading supported asset balances...</WorkspaceNotice>
          ) : visibleAssetBalances.length === 0 ? (
            <WorkspaceEmptyState
              title="No supported asset balances"
              description="No supported asset balances were detected for this wallet yet."
            />
          ) : (
            visibleAssetBalances.map((asset) => (
              <div
                key={asset.id}
                className={`${workspacePanelMutedClassName} flex items-center justify-between gap-3 p-4`}
              >
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
            ))
          )}
        </WorkspacePanel>
      </div>

      {ownerQuery.data ? (
        <NewTransactionForm walletAddress={walletAddress} onTransactionSubmitted={wallet.refresh} />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <WorkspacePanel title="Open proposals" contentClassName="space-y-4">
          {wallet.isLoading && wallet.pendingTransactions.length === 0 ? (
            <WorkspaceNotice>Loading pending proposals...</WorkspaceNotice>
          ) : wallet.loadError && wallet.pendingTransactions.length === 0 ? (
            <WorkspaceNotice tone="rose">
              Failed to load the current proposal queue.
            </WorkspaceNotice>
          ) : wallet.pendingTransactions.length === 0 ? (
            <WorkspaceEmptyState
              title="No proposals waiting"
              description="No proposals are waiting right now."
            />
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
        </WorkspacePanel>

        <WorkspacePanel title="Executed proposals" contentClassName="space-y-4">
          {wallet.isLoading && wallet.executedTransactions.length === 0 ? (
            <WorkspaceNotice>Loading executed proposals...</WorkspaceNotice>
          ) : wallet.executedTransactions.length === 0 ? (
            <WorkspaceEmptyState
              title="No executed proposals yet"
              description="No executed proposals have been detected for this wallet yet."
            />
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
        </WorkspacePanel>
      </div>
    </div>
  );
}

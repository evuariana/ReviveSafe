import { Link } from "react-router-dom";
import { useAccount } from "@luno-kit/react";
import { Copy, ExternalLink, Wallet2 } from "lucide-react";

import OwnersInfo from "@/components/wallets/owner-info";
import { NativeOperationItem } from "@/components/wallets/native-operation-item";
import { NativeProposalForm } from "@/components/wallets/native-tx-form";
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
import { Button } from "@/components/ui/button";
import { useChainToken } from "@/hooks/useChainToken";
import { useNativeMultisigWallet } from "@/hooks/useNativeMultisig";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useWorkspaceNativeWallets } from "@/hooks/useWorkspaceNativeWallets";
import { addressEquals } from "@/lib/native-multisig";
import { formatTokenBalance } from "@/lib/currency";
import type { ImportedNativeWalletRecord } from "@/types/revive";

export function NativeWalletDetail({
  wallet,
}: {
  wallet: ImportedNativeWalletRecord;
}) {
  const { account } = useAccount();
  const { chain } = usePolkadotClient();
  const token = useChainToken();
  const nativeWallet = useNativeMultisigWallet(wallet);
  const workspaceEvents = useWorkspaceNativeWallets((state) => state.events).filter(
    (event) =>
      event.chainKey === wallet.chainKey &&
      event.walletAccountIdHex.toLowerCase() === wallet.accountIdHex.toLowerCase()
  );
  const visibleAssetBalances = nativeWallet.assetBalances.filter(
    (asset) => asset.balance > 0n
  );
  const isMember = account?.address
    ? wallet.members.some((member) => addressEquals(member, account.address))
    : false;
  const hasLimitedOperations = nativeWallet.operations.some(
    (operation) => operation.detailConfidence === "limited"
  );

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Native wallet"
        title={wallet.name || "Imported native multisig"}
        description={
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-mono">{wallet.address}</span>
              <Button
                variant="ghost"
                size="sm"
                className={workspaceGhostButtonClassName}
                onClick={() => navigator.clipboard.writeText(wallet.address)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <a
                href={`${chain.explorerUrl}/account/${wallet.address}`}
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="ghost" size="sm" className={workspaceGhostButtonClassName}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </a>
            </div>
            <p className="text-base font-light leading-8 text-zinc-600 dark:text-zinc-400">
              Review members, balances, open proposals, and recent changes for
              this imported native wallet.
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
            <WorkspaceBadge tone={isMember ? "emerald" : "default"}>
              {isMember ? "Direct member" : "Read-only view"}
            </WorkspaceBadge>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {isMember
                ? "You are a direct member of this imported native wallet."
                : "You can view this native wallet, but only direct members can approve or execute proposals here."}
            </p>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <WorkspaceStatCard
          label="Native balance"
          value={
            nativeWallet.balance === undefined
              ? "Loading..."
              : `${formatTokenBalance(nativeWallet.balance, token.decimals)} ${token.symbol}`
          }
          description="Chain token balance currently held by this imported wallet."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Approval rule"
          value={`${wallet.threshold} of ${wallet.members.length}`}
          description="Exact direct multisig threshold entered during import."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Pending proposals"
          value={nativeWallet.operations.length}
          description="Pending native multisig operations ReviveSafe can currently recover."
          icon={Wallet2}
        />
        <WorkspaceStatCard
          label="Asset balances"
          value={visibleAssetBalances.length}
          description="Asset Hub balances detected for this native wallet."
          icon={Wallet2}
        />
      </div>

      {nativeWallet.loadError || hasLimitedOperations ? (
        <WorkspaceNotice tone="amber">
          {nativeWallet.loadError
            ? nativeWallet.loadError
            : "Some native proposals only expose a call hash on-chain. ReviveSafe can still show and approve them, but it can only execute the ones it can fully rebuild."}
        </WorkspaceNotice>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <OwnersInfo
          description="These are the direct members and approval rule for this wallet."
          owners={wallet.members}
          required={wallet.threshold}
          title="Members"
          userAddress={account?.address}
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
          {nativeWallet.assetBalancesQuery.isLoading ? (
            <WorkspaceNotice>Loading native asset balances...</WorkspaceNotice>
          ) : visibleAssetBalances.length === 0 ? (
            <WorkspaceEmptyState
              title="No Asset Hub balances"
              description="No Asset Hub balances were detected for this wallet yet."
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
                <div className="text-right text-sm font-semibold text-zinc-950 dark:text-white">
                  {formatTokenBalance(asset.balance, asset.decimals)} {asset.symbol}
                </div>
              </div>
            ))
          )}
        </WorkspacePanel>
      </div>

      {isMember ? <NativeProposalForm wallet={wallet} /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        <WorkspacePanel title="Open proposals" contentClassName="space-y-4">
          {nativeWallet.isLoading && nativeWallet.operations.length === 0 ? (
            <WorkspaceNotice>Loading imported native proposals...</WorkspaceNotice>
          ) : nativeWallet.operations.length === 0 ? (
            <WorkspaceEmptyState
              title="No pending native proposals"
              description="No pending native proposals were detected for this wallet."
            />
          ) : (
            nativeWallet.operations.map((operation) => (
              <NativeOperationItem
                key={operation.callHash}
                operation={operation}
              />
            ))
          )}
        </WorkspacePanel>

        <WorkspacePanel title="Saved activity" contentClassName="space-y-4">
          {workspaceEvents.length === 0 ? (
            <WorkspaceEmptyState
              title="No local activity yet"
              description="No local ReviveSafe activity has been recorded for this wallet on this browser yet."
            />
          ) : (
            workspaceEvents.slice(0, 8).map((event) => (
              <div
                key={event.id}
                className={`${workspacePanelMutedClassName} p-4`}
              >
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  {event.title}
                </div>
                <div className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                  {event.description}
                </div>
              </div>
            ))
          )}
        </WorkspacePanel>
      </div>
    </div>
  );
}

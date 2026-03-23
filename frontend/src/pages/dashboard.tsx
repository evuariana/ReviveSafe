import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@luno-kit/react";
import {
  ArrowRight,
  CheckCircle2,
  Coins,
  Inbox,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";

import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspaceNotice,
  WorkspacePanel,
  WorkspaceStatCard,
  workspaceOutlineButtonClassName,
  workspacePageClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { useChainToken } from "@/hooks/useChainToken";
import { useImportedNativeWallets } from "@/hooks/useNativeMultisig";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { useWorkspaceLiveData } from "@/hooks/useWorkspaceLiveData";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";
import { formatTokenBalance } from "@/lib/currency";
import { formatAddress } from "@/lib/utils";

interface FeedItem {
  badge?: string;
  description: string;
  href: string;
  id: string;
  meta: string;
  title: string;
  tone?: "amber" | "default" | "emerald" | "sky";
}

function FeedPanel({
  actionHref,
  actionLabel,
  emptyMessage,
  items,
  loading,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  emptyMessage: string;
  items: FeedItem[];
  loading: boolean;
  title: string;
}) {
  return (
    <WorkspacePanel
      className="h-full"
      title={title}
      actions={
        <Button asChild variant="outline" className={workspaceOutlineButtonClassName}>
          <Link to={actionHref}>{actionLabel}</Link>
        </Button>
      }
      contentClassName="space-y-3"
    >
      {loading ? (
        <WorkspaceNotice>Loading workspace data...</WorkspaceNotice>
      ) : items.length === 0 ? (
        <WorkspaceEmptyState title="Nothing here yet" description={emptyMessage} />
      ) : (
        items.map((item) => (
          <WorkspaceLinkCard
            key={item.id}
            to={item.href}
            title={item.title}
            meta={item.meta}
            description={item.description}
            badge={
              item.badge ? (
                <WorkspaceBadge tone={item.tone}>{item.badge}</WorkspaceBadge>
              ) : undefined
            }
          />
        ))
      )}
    </WorkspacePanel>
  );
}

export default function Dashboard() {
  const { account } = useAccount();
  const liveWorkspace = useWorkspaceLiveData();
  const token = useChainToken();
  const { client, chain, error: clientError, loading: clientLoading } = usePolkadotClient();
  const { mappedAccount } = useMappedAccount();
  const { myMultisigs, myMultisigsQuery, factoryAddress } = useReviveFactory();
  const importedNativeWallets = useImportedNativeWallets();
  const workspace = useWorkspaceSurfaces({
    enabled: liveWorkspace.enabled,
    includeActivity: false,
    includeAssetMetadata: false,
  });

  const accountBalanceQuery = useQuery({
    queryKey: ["connected-account-balance", chain.key, account?.address],
    enabled: !!account?.address && !!client,
    queryFn: async () => {
      const response = await client?.query.system.account(account?.address ?? "");
      return response ? BigInt(response.data.free.toString()) : 0n;
    },
  });

  const readyToExecute = useMemo(
    () =>
      workspace.proposals.filter(
        (proposal) => proposal.state === "ready_to_execute"
      ),
    [workspace.proposals]
  );

  const needsActionItems: FeedItem[] = workspace.needsAction.slice(0, 4).map((proposal) => ({
    badge: proposal.state === "ready_to_execute" ? "Ready" : "Approval",
    description: proposal.actionSummary,
    href: proposal.href,
    id: proposal.id,
    meta: `${proposal.walletTypeLabel} wallet • ${proposal.walletLabel}`,
    title: proposal.title,
    tone: proposal.state === "ready_to_execute" ? "emerald" : "amber",
  }));

  const readyItems: FeedItem[] = readyToExecute.slice(0, 4).map((proposal) => ({
    badge: proposal.rail === "native" ? "Native" : "Contract",
    description: proposal.actionSummary,
    href: proposal.href,
    id: `${proposal.id}:ready`,
    meta: `${proposal.approvalProgress} approvals • ${proposal.walletLabel}`,
    title: proposal.title,
    tone: proposal.rail === "native" ? "sky" : "default",
  }));

  const activityItems: FeedItem[] = workspace.activity.slice(0, 5).map((activity) => ({
    description: activity.description,
    href: activity.href,
    id: activity.id,
    meta: activity.walletLabel,
    title: activity.title,
  }));

  const walletPreview = [
    ...importedNativeWallets.map((wallet) => ({
      href: `/wallet/${wallet.address}`,
      id: `native:${wallet.accountIdHex}`,
      label: wallet.name || formatAddress(wallet.address, 6),
      meta: `${wallet.threshold} of ${wallet.members.length} approvals`,
      type: "Native",
      tone: "sky" as const,
    })),
    ...myMultisigs.map((walletAddress) => ({
      href: `/wallet/${walletAddress}`,
      id: `programmable:${walletAddress}`,
      label: formatAddress(walletAddress, 6),
      meta: "Contract wallet",
      type: "Contract",
      tone: "default" as const,
    })),
  ].slice(0, 6);

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Overview"
        title="Start here: what needs attention"
        description="Home gives you the quick read: whether this account is ready, what is waiting on you, and which native or contract wallets are active in this workspace."
        actions={
          <>
            <Link to="/import">
              <Button className="rounded-full px-5">Import native wallet</Button>
            </Link>
            <Link to="/create">
              <Button
                variant="outline"
                className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
              >
                Create contract wallet
              </Button>
            </Link>
          </>
        }
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={liveWorkspace.enabled ? "sky" : "amber"}>
              {liveWorkspace.enabled ? "Live updates on" : "Live updates off"}
            </WorkspaceBadge>
            <div className="space-y-3">
              <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                {liveWorkspace.enabled
                  ? `${workspace.needsAction.length} items need attention`
                  : "Load live updates when you need them"}
              </div>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                {liveWorkspace.enabled
                  ? "Keep this page for the quick read: what is blocked, what is ready, and which wallets are already in your workspace."
                  : "Proposals and activity load on demand in this beta so the dashboard stays calm until you ask for live updates."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[20px] border border-black/8 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.04]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Native wallets
                </div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                  {importedNativeWallets.length}
                </div>
              </div>
              <div className="rounded-[20px] border border-black/8 bg-white/75 p-4 dark:border-white/8 dark:bg-white/[0.04]">
                <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500 dark:text-zinc-400">
                  Ready to execute
                </div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                  {liveWorkspace.enabled ? readyToExecute.length : "Paused"}
                </div>
              </div>
            </div>
          </div>
        }
      />

      {!liveWorkspace.enabled ? (
        <WorkspacePanel
          title="Load live updates"
          description="Load proposals, activity, and wallet updates when you want them. This keeps the workspace calmer right after connect."
          actions={
            <Button className="rounded-full px-5" onClick={liveWorkspace.enable}>
              Load live updates
            </Button>
          }
        >
          <WorkspaceNotice tone="amber">
            Home will still show wallet counts and setup status below. Approvals,
            ready items, and recent changes stay paused until you ask for them.
          </WorkspaceNotice>
        </WorkspacePanel>
      ) : null}

      {(myMultisigsQuery.error || clientError) && (
        <WorkspaceNotice tone="amber">
          {(myMultisigsQuery.error as Error | null)?.message ||
            clientError ||
            "Some workspace reads are currently unavailable."}
        </WorkspaceNotice>
      )}

      <div className="grid gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <WorkspacePanel
          title="Is this account ready?"
          description="These checks show whether this wallet and network are ready for shared-wallet work."
          contentClassName="grid gap-4 md:grid-cols-3"
        >
          <WorkspaceStatCard
            label="Wallet connected"
            value={account?.address ? "Connected" : "Missing"}
            description={
              account?.address
                ? formatAddress(account.address, 6)
                : "Connect a Polkadot wallet to continue."
            }
            icon={ShieldCheck}
          />
          <WorkspaceStatCard
            label="Contract wallet access"
            value={mappedAccount?.isMapped ? "Ready" : "Needs mapping"}
            description={
              mappedAccount?.isMapped
                ? "This wallet can create, approve, and execute contract wallet work."
                : "Finish the one-time setup step to use contract wallet actions."
            }
            icon={Waypoints}
          />
          <WorkspaceStatCard
            label="Connected balance"
            value={
              clientError && !clientLoading
                ? "Unavailable"
                : accountBalanceQuery.isLoading
                  ? "Loading..."
                  : `${formatTokenBalance(accountBalanceQuery.data ?? 0n, token.decimals)} ${token.symbol}`
            }
            description={`Wallet balance on ${chain.name}.`}
            icon={Coins}
          />
        </WorkspacePanel>

        <WorkspacePanel
          title="Workspace at a glance"
          description="A quick count of the wallets and work currently visible in this workspace."
          contentClassName="grid gap-4 md:grid-cols-2"
        >
          <WorkspaceStatCard
            label="Native imports"
            value={importedNativeWallets.length.toString()}
            description="Native multisigs added for the current chain."
            icon={Waypoints}
          />
          <WorkspaceStatCard
            label="Contract wallets"
            value={myMultisigsQuery.isLoading ? "..." : myMultisigs.length.toString()}
            description="Contract wallets returned by the active ReviveSafe factory."
            icon={Sparkles}
          />
          <WorkspaceStatCard
            label="Needs attention"
            value={
              liveWorkspace.enabled
                ? workspace.needsAction.length.toString()
                : "Paused"
            }
            description={
              liveWorkspace.enabled
                ? "Approvals or executions this connected account can act on now."
                : "Load live updates to calculate current approvals and executions."
            }
            icon={Inbox}
          />
          <WorkspaceStatCard
            label="Ready to execute"
            value={liveWorkspace.enabled ? readyToExecute.length.toString() : "Paused"}
            description={
              liveWorkspace.enabled
                ? "Cross-wallet proposals that have already met the threshold."
                : "Ready-to-execute counts stay paused until you load live updates."
            }
            icon={CheckCircle2}
          />
        </WorkspacePanel>
      </div>

      {!factoryAddress ? (
        <WorkspaceNotice tone="amber">
          Contract wallet creation is unavailable until a factory is connected
          for this workspace.
        </WorkspaceNotice>
      ) : null}

      {liveWorkspace.enabled ? (
        <div className="grid gap-4 xl:grid-cols-3">
          <FeedPanel
            title="Waiting on you"
            items={needsActionItems}
            emptyMessage="Nothing is waiting on this connected account right now."
            loading={workspace.isLoading}
            actionHref="/inbox"
            actionLabel="Open Inbox"
          />
          <FeedPanel
            title="Ready to execute"
            items={readyItems}
            emptyMessage="No proposals are ready to execute across this workspace yet."
            loading={workspace.isLoading}
            actionHref="/proposals"
            actionLabel="Open Proposals"
          />
          <FeedPanel
            title="Recent changes"
            items={activityItems}
            emptyMessage="No activity has been recorded in this workspace yet."
            loading={workspace.isLoading}
            actionHref="/activity"
            actionLabel="Open Activity"
          />
        </div>
      ) : null}

      <WorkspacePanel
        title="Wallets you can open from here"
        description="Native multisigs and contract wallets live in one directory here."
        actions={
          <Button asChild variant="outline" className={workspaceOutlineButtonClassName}>
            <Link to="/wallets">
              View all wallets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        }
        contentClassName="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        {walletPreview.length === 0 ? (
          <WorkspaceEmptyState
            className="md:col-span-2 xl:col-span-3"
            title="No wallets connected"
            description="Import a native wallet or create a contract wallet to start building out this workspace."
          />
        ) : (
          walletPreview.map((wallet) => (
            <WorkspaceLinkCard
              key={wallet.id}
              to={wallet.href}
              title={wallet.label}
              meta={wallet.meta}
              description="Open balances, members, proposals, and recent changes from the same shared workspace."
              badge={<WorkspaceBadge tone={wallet.tone}>{wallet.type}</WorkspaceBadge>}
            />
          ))
        )}
      </WorkspacePanel>
    </div>
  );
}

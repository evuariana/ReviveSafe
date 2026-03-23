import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@luno-kit/react";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Coins,
  Inbox,
  ShieldCheck,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";

import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspaceNotice,
  WorkspacePanel,
  WorkspaceStatCard,
  workspaceOutlineButtonClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { useChainToken } from "@/hooks/useChainToken";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useImportedNativeWallets } from "@/hooks/useNativeMultisig";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";
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
  const token = useChainToken();
  const { client, chain, error: clientError, loading: clientLoading } = usePolkadotClient();
  const { mappedAccount } = useMappedAccount();
  const { myMultisigs, myMultisigsQuery, factoryAddress } = useReviveFactory();
  const defaultFactoryAddress = useFactoryAddress(
    (state) => state.defaultFactoryAddress
  );
  const importedNativeWallets = useImportedNativeWallets();
  const workspace = useWorkspaceSurfaces();

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
    badge: proposal.rail === "native" ? "Native" : "Programmable",
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
      meta: "Programmable contract wallet",
      type: "Programmable",
      tone: "default" as const,
    })),
  ].slice(0, 6);

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Overview"
        title="Shared wallet workspace overview"
        description="Home is the cross-wallet summary. Use it to see what needs attention now, which proposals are ready, and which native or programmable wallets are active in this workspace."
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
                Create programmable wallet
              </Button>
            </Link>
          </>
        }
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone="sky">Live workspace</WorkspaceBadge>
            <div className="space-y-3">
              <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
                {workspace.needsAction.length} items need attention
              </div>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                Cross-wallet queues stay together here, while native import remains
                manual and verified instead of auto-discovered.
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
                  Ready now
                </div>
                <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                  {readyToExecute.length}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <PublicBetaNotice compact />

      {(myMultisigsQuery.error || clientError) && (
        <WorkspaceNotice tone="amber">
          {(myMultisigsQuery.error as Error | null)?.message ||
            clientError ||
            "Some workspace reads are currently unavailable."}
        </WorkspaceNotice>
      )}

      <WorkspacePanel
        title="Workspace status"
        description="Native import is manual and verified. Programmable contract-wallet writes still require account mapping and an active factory."
        contentClassName="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
      >
        <WorkspaceStatCard
          label="Connected account"
          value={account?.address ? "Connected" : "Missing"}
          description={account?.address ?? "Connect a Polkadot wallet to continue."}
          icon={ShieldCheck}
        />
        <WorkspaceStatCard
          label="Programmable signer"
          value={mappedAccount?.isMapped ? "Ready" : "Needs mapping"}
          description={
            mappedAccount?.mappedH160 ??
            "Native import works without mapping, but programmable wallet writes do not."
          }
          icon={Waypoints}
        />
        <WorkspaceStatCard
          label="Factory"
          value={factoryAddress ? "Configured" : "Missing"}
          description={
            factoryAddress ??
            defaultFactoryAddress ??
            "Deploy or set a factory for contract-wallet flows."
          }
          icon={Blocks}
        />
        <WorkspaceStatCard
          label="Imported native wallets"
          value={importedNativeWallets.length.toString()}
          description="Direct native multisigs imported for the current chain."
          icon={Waypoints}
        />
        <WorkspaceStatCard
          label="Programmable wallets"
          value={myMultisigsQuery.isLoading ? "..." : myMultisigs.length.toString()}
          description="Contract wallets returned by the active ReviveSafe factory."
          icon={Sparkles}
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
          description={`Native runtime balance on ${chain.name}.`}
          icon={Coins}
        />
        <WorkspaceStatCard
          label="Needs action"
          value={workspace.needsAction.length.toString()}
          description="Approvals or executions this connected account can act on now."
          icon={Inbox}
        />
        <WorkspaceStatCard
          label="Ready to execute"
          value={readyToExecute.length.toString()}
          description="Cross-wallet proposals that have already met the threshold."
          icon={CheckCircle2}
        />
      </WorkspacePanel>

      <div className="grid gap-4 xl:grid-cols-3">
        <FeedPanel
          title="Needs attention"
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
          title="Recent activity"
          items={activityItems}
          emptyMessage="No activity has been recorded in this workspace yet."
          loading={workspace.isLoading}
          actionHref="/activity"
          actionLabel="Open Activity"
        />
      </div>

      <WorkspacePanel
        title="Wallet preview"
        description="Imported native multisigs and programmable contract wallets share the same workspace, but they still expose different capabilities."
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
            description="Import a native wallet or create a programmable one to start building out this workspace."
          />
        ) : (
          walletPreview.map((wallet) => (
            <WorkspaceLinkCard
              key={wallet.id}
              to={wallet.href}
              title={wallet.label}
              meta={wallet.meta}
              description="Open balances, members, proposals, and recent activity from the same shared workspace."
              badge={<WorkspaceBadge tone={wallet.tone}>{wallet.type}</WorkspaceBadge>}
            />
          ))
        )}
      </WorkspacePanel>
    </div>
  );
}

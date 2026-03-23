import { Inbox, LifeBuoy, Sparkles } from "lucide-react";

import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspaceNotice,
  WorkspacePanel,
  workspacePageClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { useWorkspaceLiveData } from "@/hooks/useWorkspaceLiveData";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";

export default function InboxPage() {
  const liveWorkspace = useWorkspaceLiveData();
  const workspace = useWorkspaceSurfaces({
    enabled: liveWorkspace.enabled,
    includeAssetMetadata: false,
  });

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Inbox"
        title="What needs attention right now"
        description="Use Inbox like a shared to-do list. It shows approvals waiting on you, recent updates worth checking, and wallet notices that still matter."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={liveWorkspace.enabled ? "amber" : "sky"}>
              {liveWorkspace.enabled ? "Needs attention" : "On-demand queue"}
            </WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {liveWorkspace.enabled
                ? `${workspace.needsAction.length} actionable items`
                : "Load the shared to-do list when you need it"}
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {liveWorkspace.enabled
                ? "Inbox is intentionally current-state oriented. Historical browsing stays in Activity so this page can remain easy to scan."
                : "To keep the workspace stable, Inbox now loads its cross-wallet action queue on demand instead of rehydrating it automatically after every connect."}
            </p>
          </div>
        }
      />

      {!liveWorkspace.enabled ? (
        <WorkspacePanel
          title="Load Inbox data"
          description="When you load Inbox, ReviveSafe will recover approvals waiting on you, recent updates, and wallet notices for this connected account."
          actions={
            <Button className="rounded-full px-5" onClick={liveWorkspace.enable}>
              Load Inbox
            </Button>
          }
        >
          <WorkspaceNotice tone="amber">
            This beta no longer keeps the entire shared-wallet queue running in
            the background after connect.
          </WorkspaceNotice>
        </WorkspacePanel>
      ) : null}

      {liveWorkspace.enabled ? (
        <div className="grid gap-4 xl:grid-cols-3">
        <WorkspacePanel title="Needs action" contentClassName="space-y-3">
          {workspace.needsAction.length === 0 ? (
            <WorkspaceEmptyState
              icon={Inbox}
              title="All clear"
              description="No approvals are waiting on you right now."
            />
          ) : (
            workspace.needsAction.map((proposal) => (
              <WorkspaceLinkCard
                key={proposal.id}
                to={proposal.href}
                title={
                  proposal.state === "ready_to_execute"
                    ? "Ready to execute"
                    : "Approval requested"
                }
                meta={proposal.walletLabel}
                description={proposal.actionSummary}
                badge={
                  <WorkspaceBadge
                    tone={
                      proposal.state === "ready_to_execute" ? "emerald" : "amber"
                    }
                  >
                    {proposal.state === "ready_to_execute" ? "Ready" : "Pending"}
                  </WorkspaceBadge>
                }
              />
            ))
          )}
        </WorkspacePanel>

        <WorkspacePanel title="Updates" contentClassName="space-y-3">
          {workspace.updates.length === 0 ? (
            <WorkspaceEmptyState
              icon={Sparkles}
              title="No fresh updates"
              description="No recent executed updates have been detected yet."
            />
          ) : (
            workspace.updates.map((update) => (
              <WorkspaceLinkCard
                key={update.id}
                to={update.href}
                title={update.title}
                meta={update.walletLabel}
                description={update.description}
                badge={<WorkspaceBadge tone="sky">Update</WorkspaceBadge>}
              />
            ))
          )}
        </WorkspacePanel>

        <WorkspacePanel title="Wallet lifecycle" contentClassName="space-y-3">
          {workspace.lifecycle.length === 0 ? (
            <WorkspaceEmptyState
              icon={LifeBuoy}
              title="No lifecycle notices"
              description="No import or lifecycle notices are active right now."
            />
          ) : (
            workspace.lifecycle.map((event) => (
              <WorkspaceLinkCard
                key={event.id}
                to={`/wallet/${event.walletAddress}`}
                title={event.title}
                description={event.description}
                badge={<WorkspaceBadge tone="default">Wallet</WorkspaceBadge>}
              />
            ))
          )}
        </WorkspacePanel>
        </div>
      ) : null}
    </div>
  );
}

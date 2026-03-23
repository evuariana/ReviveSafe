import { Inbox, LifeBuoy, Sparkles } from "lucide-react";

import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspacePanel,
} from "@/components/layout/workspace-surfaces";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";

export default function InboxPage() {
  const workspace = useWorkspaceSurfaces();

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Inbox"
        title="Actionable updates across your wallets"
        description="Use Inbox for what needs attention now, and keep activity history separate from the approval queue."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone="amber">Needs attention</WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {workspace.needsAction.length} actionable items
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Inbox is intentionally current-state oriented: approvals waiting on
              you, recent execution updates, and wallet lifecycle notices.
            </p>
          </div>
        }
      />

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
    </div>
  );
}

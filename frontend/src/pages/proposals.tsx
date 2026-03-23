import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspacePanel,
  WorkspaceNotice,
  workspaceOutlineButtonClassName,
  workspacePageClassName,
} from "@/components/layout/workspace-surfaces";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";
import { useWorkspaceLiveData } from "@/hooks/useWorkspaceLiveData";

type ProposalFilter = "all" | "pending" | "ready";

export default function ProposalsPage() {
  const [filter, setFilter] = useState<ProposalFilter>("all");
  const liveWorkspace = useWorkspaceLiveData();
  const workspace = useWorkspaceSurfaces({
    enabled: liveWorkspace.enabled,
    includeActivity: false,
    includeAssetMetadata: false,
  });

  const visibleProposals = useMemo(() => {
    if (filter === "pending") {
      return workspace.proposals.filter(
        (proposal) => proposal.state === "pending_approval"
      );
    }

    if (filter === "ready") {
      return workspace.proposals.filter(
        (proposal) => proposal.state === "ready_to_execute"
      );
    }

    return workspace.proposals;
  }, [filter, workspace.proposals]);

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Proposals"
        title="Open approvals and ready items"
        description="Use Proposals as the shared work queue for actions that are still open across imported native and contract wallets."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={liveWorkspace.enabled ? "sky" : "amber"}>
              {liveWorkspace.enabled ? "Unified queue" : "Live updates off"}
            </WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {liveWorkspace.enabled
                ? `${workspace.proposals.length} open proposals`
                : "Load open proposals when you need them"}
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {liveWorkspace.enabled
                ? "This page is for unfinished work, not history. Activity stays separate so teams can quickly see what still needs action."
                : "Proposals stay paused until you ask for them so the workspace stays calmer right after connect."}
            </p>
          </div>
        }
      />

      {!liveWorkspace.enabled ? (
        <WorkspacePanel
          title="Load proposals"
          description="ReviveSafe will pull open approvals and ready-to-execute items across imported native and contract wallets for this connected account."
          actions={
            <Button className="rounded-full px-5" onClick={liveWorkspace.enable}>
              Load Proposals
            </Button>
          }
        >
          <WorkspaceNotice tone="amber">
            Live updates stay off until you ask for them.
          </WorkspaceNotice>
        </WorkspacePanel>
      ) : null}

      {liveWorkspace.enabled ? (
        <WorkspacePanel
        title="Proposal queue"
        description="Filter by state without splitting native and contract wallets into separate tools."
        contentClassName="space-y-5"
      >
        <div className="flex flex-wrap gap-2">
          {[
            ["all", "All proposals"],
            ["pending", "Pending approval"],
            ["ready", "Ready to execute"],
          ].map(([value, label]) => (
            <Button
              key={value}
              type="button"
              variant={filter === value ? "default" : "outline"}
              className={
                filter === value
                  ? "rounded-full"
                  : `rounded-full ${workspaceOutlineButtonClassName}`
              }
              onClick={() => setFilter(value as ProposalFilter)}
            >
              {label}
            </Button>
          ))}
        </div>

        {workspace.isLoading ? (
          <WorkspaceNotice>Loading workspace proposals...</WorkspaceNotice>
        ) : visibleProposals.length === 0 ? (
          <WorkspaceEmptyState
            title="No matching proposals"
            description="No proposals match this filter yet."
          />
        ) : (
          <div className="space-y-3">
            {visibleProposals.map((proposal) => (
              <WorkspaceLinkCard
                key={proposal.id}
                to={proposal.href}
                title={proposal.title}
                meta={`${proposal.walletTypeLabel} wallet • ${proposal.walletLabel}`}
                description={proposal.actionSummary}
                badge={
                  <WorkspaceBadge
                    tone={
                      proposal.state === "ready_to_execute" ? "emerald" : "amber"
                    }
                  >
                    {proposal.state === "ready_to_execute"
                      ? "Ready to execute"
                      : "Pending approval"}
                  </WorkspaceBadge>
                }
                note={
                  <>
                    <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                      {proposal.approvalProgress}
                    </div>
                    {proposal.note ? (
                      <div className="mt-3">
                        <WorkspaceNotice tone="amber">{proposal.note}</WorkspaceNotice>
                      </div>
                    ) : null}
                  </>
                }
              />
            ))}
          </div>
        )}
        </WorkspacePanel>
      ) : null}
    </div>
  );
}

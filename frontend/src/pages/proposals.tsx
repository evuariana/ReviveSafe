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
} from "@/components/layout/workspace-surfaces";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";

type ProposalFilter = "all" | "pending" | "ready";

export default function ProposalsPage() {
  const [filter, setFilter] = useState<ProposalFilter>("all");
  const workspace = useWorkspaceSurfaces();

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
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Proposals"
        title="Cross-wallet proposal queue"
        description="Review pending approvals and ready-to-execute items across imported native and programmable wallets from one queue."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone="sky">Unified queue</WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {workspace.proposals.length} open proposals
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              This is the work queue, not the historical ledger. Activity stays
              separate so teams can quickly see what still needs action.
            </p>
          </div>
        }
      />

      <WorkspacePanel
        title="Proposal queue"
        description="Filter the queue by approval state without splitting native and programmable wallets into separate tools."
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
    </div>
  );
}

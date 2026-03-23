import { ScrollText } from "lucide-react";

import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspaceNotice,
  WorkspacePanel,
} from "@/components/layout/workspace-surfaces";
import { useWorkspaceSurfaces } from "@/hooks/useWorkspaceSurfaces";

export default function ActivityPage() {
  const workspace = useWorkspaceSurfaces();

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Activity"
        title="Workspace activity feed"
        description="Activity is a best-effort workspace feed. Native events recorded in ReviveSafe carry local timestamps, while programmable executions are currently shown as untimed wallet snapshots until indexed history exists."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge>Best-effort feed</WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {workspace.activity.length} recent events
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Native events with recorded timestamps are shown chronologically.
              Programmable items are still untimed snapshots recovered from current
              wallet state, not a full indexed ledger.
            </p>
          </div>
        }
      />

      <WorkspacePanel
        title="Workspace activity"
        description="This feed stays explicit about what is truly time-ordered versus what is only recoverable from current wallet state."
        contentClassName="space-y-4"
      >
        <WorkspaceNotice tone="amber">
          Native activity is intentionally partial without a dedicated indexer, and
          programmable execution items are currently untimed snapshots rather than
          a chronological cross-wallet ledger.
        </WorkspaceNotice>

        {workspace.isLoading ? (
          <WorkspaceNotice>Loading workspace activity...</WorkspaceNotice>
        ) : workspace.activity.length === 0 ? (
          <WorkspaceEmptyState
            icon={ScrollText}
            title="No activity yet"
            description="No activity has been detected in this workspace yet."
          />
        ) : (
          workspace.activity.map((activity) => (
            <WorkspaceLinkCard
              key={activity.id}
              to={activity.href}
              title={activity.title}
              meta={`${activity.walletLabel} • ${
                activity.chronology === "recorded"
                  ? "Recorded locally"
                  : "Untimed programmable snapshot"
              }`}
              description={activity.description}
              badge={
                <WorkspaceBadge
                  tone={activity.chronology === "recorded" ? "sky" : "default"}
                >
                  {activity.chronology === "recorded" ? "Recorded" : "Snapshot"}
                </WorkspaceBadge>
              }
            />
          ))
        )}
      </WorkspacePanel>
    </div>
  );
}

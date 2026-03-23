import { ScrollText } from "lucide-react";

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

export default function ActivityPage() {
  const liveWorkspace = useWorkspaceLiveData();
  const workspace = useWorkspaceSurfaces({
    enabled: liveWorkspace.enabled,
    includeAssetMetadata: false,
  });

  return (
    <div className={workspacePageClassName}>
      <WorkspaceHero
        eyebrow="Activity"
        title="What changed recently"
        description="Activity is a best-effort feed of recent wallet changes. ReviveSafe stays explicit about what is truly time-ordered and what is only recoverable as a current snapshot."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={liveWorkspace.enabled ? "default" : "amber"}>
              {liveWorkspace.enabled ? "Best-effort feed" : "On-demand feed"}
            </WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {liveWorkspace.enabled
                ? `${workspace.activity.length} recent events`
                : "Load recent changes when you need context"}
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {liveWorkspace.enabled
                ? "Native events with recorded timestamps are shown chronologically. Programmable items are still untimed snapshots from current wallet state, not a full indexed ledger yet."
                : "Activity is now an explicit best-effort load in this beta. That keeps history reads from constantly rebuilding across every connected wallet."}
            </p>
          </div>
        }
      />

      {!liveWorkspace.enabled ? (
        <WorkspacePanel
          title="Load recent activity"
          description="ReviveSafe will fetch the latest wallet updates and best-effort recorded events for this workspace when you ask for them."
          actions={
            <Button className="rounded-full px-5" onClick={liveWorkspace.enable}>
              Load Activity
            </Button>
          }
        >
          <WorkspaceNotice tone="amber">
            Activity no longer auto-rebuilds in the background after every
            connect. This keeps the workspace steadier while the beta still
            depends on direct browser reads.
          </WorkspaceNotice>
        </WorkspacePanel>
      ) : (
        <WorkspacePanel
        title="Workspace activity"
        description="Use this feed for recent context, while keeping in mind that full cross-wallet history still needs dedicated indexing."
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
      )}
    </div>
  );
}

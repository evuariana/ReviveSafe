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
        description="Activity shows the latest changes ReviveSafe can recover. Some native and contract wallet history is still partial in this beta, so use this as context instead of a full audit log."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone={liveWorkspace.enabled ? "default" : "amber"}>
              {liveWorkspace.enabled ? "Recent changes" : "Live updates off"}
            </WorkspaceBadge>
            <div className="font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
              {liveWorkspace.enabled
                ? `${workspace.activity.length} recent events`
                : "Load recent changes when you need context"}
            </div>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              {liveWorkspace.enabled
                ? "Use this page for context about what changed recently. Full cross-wallet history still needs better indexing in this beta."
                : "Activity stays paused until you ask for it so the workspace stays calmer right after connect."}
            </p>
          </div>
        }
      />

      {!liveWorkspace.enabled ? (
        <WorkspacePanel
          title="Load activity"
          description="ReviveSafe will fetch the latest wallet updates and saved activity for this workspace when you ask for them."
          actions={
            <Button className="rounded-full px-5" onClick={liveWorkspace.enable}>
              Load Activity
            </Button>
          }
        >
          <WorkspaceNotice tone="amber">
            Live updates stay off until you ask for them.
          </WorkspaceNotice>
        </WorkspacePanel>
      ) : (
        <WorkspacePanel
        title="Workspace activity"
        description="Use this feed for recent context, while keeping in mind that full cross-wallet history still needs dedicated indexing."
        contentClassName="space-y-4"
      >
        <WorkspaceNotice tone="amber">
          Some items in this beta are still partial. Native history needs better
          indexing, and contract wallet updates are not yet a full timeline.
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
                  : "Current contract wallet snapshot"
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

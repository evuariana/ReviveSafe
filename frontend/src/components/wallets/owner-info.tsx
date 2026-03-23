import { Copy, Shield, Users } from "lucide-react";

import {
  WorkspaceBadge,
  WorkspacePanel,
  workspaceGhostButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";

interface OwnersInfoProps {
  description?: string;
  owners?: string[];
  required?: number;
  title?: string;
  userAddress?: string;
}

export default function OwnersInfo({
  description,
  owners,
  required,
  title = "Members",
  userAddress,
}: OwnersInfoProps) {
  return (
    <WorkspacePanel
      title={
        <span className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          {title}
        </span>
      }
      contentClassName="space-y-4"
    >
      <div className={`${workspacePanelMutedClassName} p-4 text-sm text-zinc-700 dark:text-zinc-300`}>
        <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
          <Shield className="h-4 w-4" />
          {required ?? "..."} of {owners?.length ?? "..."} approvals needed
        </div>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>

      <div className="space-y-3">
        {(owners ?? []).map((owner, index) => {
          const isCurrentOwner = owner.toLowerCase() === userAddress?.toLowerCase();

          return (
            <div
              key={owner}
              className={`${workspacePanelMutedClassName} flex items-center justify-between gap-3 p-3`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-black/8 bg-white/70 text-sm font-semibold text-zinc-700 dark:border-white/8 dark:bg-white/[0.04] dark:text-zinc-200">
                  {index + 1}
                </div>
                <div>
                  <div className="font-mono text-sm text-zinc-950 dark:text-white">
                    {formatAddress(owner, 6)}
                  </div>
                  {isCurrentOwner ? (
                    <div className="mt-2">
                      <WorkspaceBadge tone="emerald">You</WorkspaceBadge>
                    </div>
                  ) : null}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className={workspaceGhostButtonClassName}
                onClick={() => navigator.clipboard.writeText(owner)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </WorkspacePanel>
  );
}

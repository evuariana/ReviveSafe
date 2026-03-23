import { useState } from "react";
import { CheckCircle, Clock, FileWarning, Layers3 } from "lucide-react";

import {
  WorkspaceBadge,
  WorkspaceNotice,
  workspaceListItemClassName,
  workspaceOutlineButtonClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import {
  useNativeMultisigActions,
  type NativeMultisigOperationView,
} from "@/hooks/useNativeMultisig";
import { formatAddress } from "@/lib/utils";

export function NativeOperationItem({
  operation,
}: {
  operation: NativeMultisigOperationView;
}) {
  const actions = useNativeMultisigActions(operation.wallet);
  const [error, setError] = useState<string>();

  return (
    <div id={`proposal-${operation.callHash.slice(2, 10)}`} className={workspaceListItemClassName}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            Imported native proposal
          </div>
          <div className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-950 dark:text-white">
            {operation.wallet.name || "Imported native proposal"}
          </div>
          <div className="mt-2 font-mono text-xs leading-6 text-zinc-500 dark:text-zinc-400">
            {operation.callHash}
          </div>
          <div className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            {operation.actionSummary}
          </div>
        </div>

        <div className="space-y-3 sm:text-right">
          {operation.isThresholdMet ? (
            <WorkspaceBadge tone="sky">
              <CheckCircle className="h-3.5 w-3.5" />
              Ready to execute
            </WorkspaceBadge>
          ) : (
            <WorkspaceBadge tone="amber">
              <Clock className="h-3.5 w-3.5" />
              Pending approval
            </WorkspaceBadge>
          )}
          <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
            {operation.approvalCount}/{operation.threshold} approvals
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <WorkspaceBadge tone="default">
          <Layers3 className="h-3.5 w-3.5" />
          {operation.originMethod === "as_multi"
            ? "Recovered from chain history"
            : operation.originMethod === "approve_as_multi"
              ? "Hash-only first approval"
              : "Imported pending call"}
        </WorkspaceBadge>
        <WorkspaceBadge tone="default">
          Depositor {formatAddress(operation.depositor, 6)}
        </WorkspaceBadge>
      </div>

      {operation.blockedReason ? (
        <div className="mt-4">
          <WorkspaceNotice tone="amber">
            <span className="flex items-start gap-2">
              <FileWarning className="mt-0.5 h-4 w-4 shrink-0" />
              {operation.blockedReason}
            </span>
          </WorkspaceNotice>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4">
          <WorkspaceNotice tone="rose">{error}</WorkspaceNotice>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {operation.canApprove ? (
          <Button
            variant="outline"
            size="sm"
            className={workspaceOutlineButtonClassName}
            disabled={actions.isSubmitting}
            onClick={async () => {
              setError(undefined);
              try {
                await actions.approveOperation(operation);
              } catch (actionError) {
                setError(
                  actionError instanceof Error
                    ? actionError.message
                    : "Approval failed."
                );
              }
            }}
          >
            {actions.isSubmitting ? "Submitting..." : "Approve"}
          </Button>
        ) : null}

        {operation.canExecute ? (
          <Button
            size="sm"
            className="rounded-full"
            disabled={actions.isSubmitting}
            onClick={async () => {
              setError(undefined);
              try {
                await actions.executeOperation(operation);
              } catch (actionError) {
                setError(
                  actionError instanceof Error
                    ? actionError.message
                    : "Execution failed."
                );
              }
            }}
          >
            {actions.isSubmitting ? "Submitting..." : "Execute"}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

import type { ReactNode } from "react";
import { Copy, Loader2, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";

export function MappingGate({ children }: { children: ReactNode }) {
  const {
    mappedAccount,
    isLoading,
    isMapping,
    mapAccount,
    mappingError,
    mappingStatusError,
    refetch,
  } = useMappedAccount();
  const { client, error: clientError, loading: clientLoading } = usePolkadotClient();

  if (!mappedAccount) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Checking wallet activation...
        </p>
      </div>
    );
  }

  if (mappedAccount.isMapped) {
    return <>{children}</>;
  }

  if (mappingStatusError && !clientLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-[28px] border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
            Mapping check unavailable
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            ReviveSafe could not verify this account's mapping yet
          </h2>
          <p className="mt-3 text-sm leading-7 text-amber-900/80 dark:text-amber-100/80">
            We could not confirm whether this account already has a usable Revive
            mapping on the active network. Retry the check before submitting a new
            activation transaction.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              onClick={() => void refetch()}
            >
              Check again
            </Button>
          </div>
          <p className="mt-4 text-sm leading-7 text-amber-900/80 dark:text-amber-100/80">
            {mappingStatusError}
          </p>
        </div>
      </div>
    );
  }

  const copyValue = (value: string) => {
    void navigator.clipboard.writeText(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
            <Waypoints className="h-3.5 w-3.5" />
            Activation required
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
              Activate your ReviveSafe address
            </h2>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Before this account can create wallets, approve proposals, or run
              contract actions, Asset Hub needs one activation transaction.
              ReviveSafe will use the mapped H160 address below for every
              wallet action.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              "Create wallets",
              "Approve proposals",
              "Run contract actions",
            ].map((label) => (
              <div
                key={label}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full max-w-sm rounded-[28px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            One step left
          </div>
          <div className="mt-3 text-xl font-semibold text-zinc-950 dark:text-white">
            Submit `revive.map_account()`
          </div>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
            Confirm one transaction in your wallet. This runs once per account
            and unlocks the rest of the workspace.
          </p>

          <Button
            className="mt-5 h-11 rounded-full bg-zinc-950 px-5 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            onClick={() => void mapAccount()}
            disabled={isMapping || clientLoading || !client || !!clientError}
          >
            {isMapping ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Activating wallet...
              </>
            ) : clientLoading ? (
              "Waiting for network..."
            ) : clientError || !client ? (
              "Network connection required"
            ) : (
              "Activate wallet"
            )}
          </Button>

          <p className="mt-3 text-xs leading-6 text-zinc-500 dark:text-zinc-400">
            No funds move here. This only prepares the on-chain identity
            ReviveSafe uses for shared wallet actions.
          </p>
          {clientError && (
            <p className="mt-3 text-xs leading-6 text-amber-700 dark:text-amber-300">
              ReviveSafe cannot reach the active runtime right now. Reconnect to
              the selected network and try again.
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                Connected SS58
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Your extension account
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
              onClick={() => copyValue(mappedAccount.ss58Address)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 break-all font-mono text-sm leading-7 text-zinc-950 dark:text-white">
            {mappedAccount.ss58Address}
          </div>
        </div>

        <div className="rounded-[24px] border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                ReviveSafe address
              </div>
              <div className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                The H160 address used across the app
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full text-zinc-500 hover:bg-zinc-200 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
              onClick={() => copyValue(mappedAccount.mappedH160)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-4 break-all font-mono text-sm leading-7 text-zinc-950 dark:text-white">
            {mappedAccount.mappedH160}
          </div>
        </div>
      </div>

      {(mappingError || clientError) && (
        <div className="rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200">
          {mappingError || clientError}
        </div>
      )}
    </div>
  );
}

import { LifeBuoy, ShieldAlert } from "lucide-react";

import { releaseDocs, supportLabel, supportUrl } from "@/config/release";

export function BetaSupportCard() {
  return (
    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex items-center gap-2 font-semibold">
        <ShieldAlert className="h-4 w-4" />
        Beta safety and support
      </div>
      <p className="mt-2 leading-7">
        This beta currently supports programmable contract wallets on Asset Hub.
        Contracts are treated as unaudited in this repo, so verify the selected
        network and active factory before moving funds.
      </p>
      <div className="mt-4 flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-amber-900 dark:text-amber-100">
        <a
          href={supportUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 hover:underline"
        >
          <LifeBuoy className="h-3.5 w-3.5" />
          {supportLabel}
        </a>
        <a
          href={releaseDocs.readinessUrl}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Release readiness
        </a>
        <a
          href={releaseDocs.trustSecurityUrl}
          target="_blank"
          rel="noreferrer"
          className="hover:underline"
        >
          Trust and security
        </a>
      </div>
    </div>
  );
}

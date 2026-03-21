import { Info } from "lucide-react";

import { releaseDocs, supportLabel, supportUrl } from "@/config/release";

interface PublicBetaNoticeProps {
  compact?: boolean;
}

export function PublicBetaNotice({
  compact = false,
}: PublicBetaNoticeProps = {}) {
  return (
    <div
      className={`rounded-[24px] border border-sky-200 bg-sky-50 text-sky-950 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100 ${
        compact ? "p-4" : "p-5"
      }`}
    >
      <div className="flex items-start gap-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">Current beta scope</div>
          <p className="mt-1 text-sm leading-6">
            ReviveSafe currently supports programmable contract wallets on Paseo
            Asset Hub and Polkadot Asset Hub. Native wallet import, proxy
            wallets, and native-to-programmable upgrade flows are not live yet.
          </p>
          <p className="mt-2 text-xs leading-5 text-sky-800 dark:text-sky-200">
            Supported wallet connections in this beta: Talisman, SubWallet, and
            Polkadot.js through LunoKit.
          </p>
          <p className="mt-2 text-xs leading-5 text-sky-800 dark:text-sky-200">
            Contracts are currently treated as unaudited in this repo. Verify
            the network and active factory before using the beta, and use the
            support path if a flow blocks you.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-sky-900 dark:text-sky-100">
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
            <a
              href={supportUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {supportLabel}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

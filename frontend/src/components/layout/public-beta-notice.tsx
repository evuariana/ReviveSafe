import { Info } from "lucide-react";

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
          <div className="font-semibold">Current public beta scope</div>
          <p className="mt-1 text-sm leading-6">
            ReviveSafe currently supports programmable contract wallets on Paseo
            Asset Hub and Polkadot Asset Hub. Native wallet import, proxy
            wallets, and native-to-programmable upgrade flows are not live yet.
          </p>
          <p className="mt-2 text-xs leading-5 text-sky-800 dark:text-sky-200">
            Supported wallet connections in this beta: Talisman, SubWallet, and
            Polkadot.js through LunoKit.
          </p>
        </div>
      </div>
    </div>
  );
}

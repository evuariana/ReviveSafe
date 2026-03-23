import { LifeBuoy } from "lucide-react";

import { supportLabel, supportUrl } from "@/config/release";

export function BetaSupportCard() {
  return (
    <div className="flex items-center justify-between gap-3 border-t border-zinc-200/80 pt-4 dark:border-white/8">
      <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-zinc-300">
        Private beta
      </div>
      <a
        href={supportUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex h-9 items-center gap-2 rounded-full border border-black/10 bg-white/85 px-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-700 transition duration-300 ease-premium hover:bg-white hover:text-zinc-950 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08] dark:hover:text-white"
      >
        <LifeBuoy className="h-3.5 w-3.5" />
        {supportLabel}
      </a>
    </div>
  );
}

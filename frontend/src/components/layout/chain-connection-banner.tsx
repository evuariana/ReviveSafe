import { AlertTriangle } from "lucide-react";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";

export function ChainConnectionBanner() {
  const { chain, error } = usePolkadotClient();

  if (!error) {
    return null;
  }

  return (
    <div className="mb-6 rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        <div>
          <div className="font-semibold">Chain connection unavailable</div>
          <p className="mt-1 leading-6">
            ReviveSafe could not connect to {chain.name}. Read and write data may
            be incomplete until the network connection recovers. Check the
            selected network, RPC availability, and your wallet, then refresh.
          </p>
          <p className="mt-2 text-xs leading-5 text-amber-800 dark:text-amber-200">
            {error}
          </p>
        </div>
      </div>
    </div>
  );
}

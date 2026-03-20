import { useEffect, useRef, useState } from "react";
import { useSwitchChain } from "@luno-kit/react";
import { Check, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

export function ChainSelector() {
  const { chains, currentChain, switchChain } = useSwitchChain();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        className="h-11 min-w-[172px] justify-between rounded-full border-zinc-200 bg-white/90 px-4 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-200 dark:hover:bg-white/[0.08]"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="flex items-center gap-2">
          {currentChain?.chainIconUrl && (
            <img
              src={currentChain.chainIconUrl}
              alt=""
              className="h-4 w-4 rounded-full"
            />
          )}
          <span>{currentChain?.name ?? "Select chain"}</span>
        </span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </Button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-white/10 dark:bg-[#0b0b0b]">
          <div className="px-2 pb-2 pt-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            Switch network
          </div>
          <div className="space-y-1">
            {chains.map((chain) => {
              const isActive =
                currentChain?.genesisHash === chain.genesisHash;

              return (
                <button
                  key={chain.genesisHash}
                  type="button"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/[0.06]"
                  onClick={() => {
                    switchChain({ chainId: chain.genesisHash });
                    setOpen(false);
                  }}
                >
                  <span className="flex items-center gap-2">
                    {chain.chainIconUrl && (
                      <img
                        src={chain.chainIconUrl}
                        alt=""
                        className="h-4 w-4 rounded-full"
                      />
                    )}
                  <span>{chain.name}</span>
                  {chain.testnet && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                        testnet
                      </span>
                    )}
                  </span>
                  {isActive && <Check className="h-4 w-4 text-zinc-900 dark:text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

import { Wallet } from "lucide-react";
import { useAccount } from "@luno-kit/react";
import { useAccountModal, useConnectModal } from "@luno-kit/ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ConnectButtonProps {
  className?: string;
  iconSectionClassName?: string;
}

export function ConnectButton({
  className,
  iconSectionClassName,
}: ConnectButtonProps = {}) {
  const { open: openConnectModal } = useConnectModal();
  const { open: openAccountModal } = useAccountModal();
  const { account } = useAccount();

  const isConnected = !!account;
  const canOpenModal = isConnected ? !!openAccountModal : !!openConnectModal;
  const displayAddress = account?.address
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : "Connect";
  const handleClick = () => {
    if (isConnected) {
      openAccountModal?.();
      return;
    }

    openConnectModal?.();
  };

  return (
    <div className="group relative">
      <div className="pointer-events-none absolute -inset-[2px] rounded-full bg-gradient-to-r from-[#ff4d6d] via-[#fb7185] to-[#f59e0b] opacity-0 blur-md transition-all duration-500 group-hover:opacity-40 group-hover:blur-lg dark:opacity-20" />
      <Button
        type="button"
        variant="outline"
        className={cn(
          "relative h-11 overflow-hidden rounded-full border border-zinc-200 bg-white p-0 text-zinc-900 hover:bg-zinc-50 hover:text-zinc-900 dark:border-white/10 dark:bg-[#070707] dark:text-white dark:hover:bg-[#111111] dark:hover:text-white",
          className,
        )}
        onClick={handleClick}
        disabled={!canOpenModal}
      >
        <span className="flex items-center gap-0">
          <span
            className={cn(
              "flex h-11 items-center justify-center border-r border-zinc-200 px-3 dark:border-white/10",
              iconSectionClassName,
            )}
          >
            <Wallet className="h-4 w-4" />
          </span>
          <span className="px-4 text-sm">{displayAddress}</span>
        </span>
      </Button>
    </div>
  );
}

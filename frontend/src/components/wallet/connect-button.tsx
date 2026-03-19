import { Wallet } from "lucide-react";
import { useAccount } from "@luno-kit/react";
import { useAccountModal, useConnectModal } from "@luno-kit/ui";

import { Button } from "@/components/ui/button";

export function ConnectButton() {
  const { open: openConnectModal } = useConnectModal();
  const { open: openAccountModal } = useAccountModal();
  const { account } = useAccount();

  const isConnected = !!account;
  const displayAddress = account?.address
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : "Connect";

  return (
    <div className="group relative">
      <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-[#ff4d6d] via-[#fb7185] to-[#f59e0b] opacity-30 blur-md transition-all duration-500 group-hover:opacity-80 group-hover:blur-lg" />
      <Button
        variant="outline"
        className="relative h-10 overflow-hidden rounded-xl border-0 bg-slate-950 p-0 text-white hover:bg-slate-950 hover:text-white"
        onClick={isConnected ? openAccountModal : openConnectModal}
      >
        <span className="flex items-center gap-0">
          <span className="flex h-10 items-center justify-center border-r border-white/15 px-3">
            <Wallet className="h-4 w-4" />
          </span>
          <span className="px-4 text-sm">{displayAddress}</span>
        </span>
      </Button>
    </div>
  );
}


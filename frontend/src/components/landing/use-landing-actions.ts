import { useAccount } from "@luno-kit/react";
import { useConnectModal } from "@luno-kit/ui";
import { useNavigate } from "react-router-dom";

export function useLandingActions() {
  const navigate = useNavigate();
  const { account } = useAccount();
  const { open: openConnectModal } = useConnectModal();

  const goTo = (path: string) => {
    if (!account) {
      openConnectModal?.();
      return;
    }

    navigate(path);
  };

  return {
    handleCreate: () => goTo("/create"),
    handleImport: () => goTo("/register"),
    isConnected: !!account,
  };
}

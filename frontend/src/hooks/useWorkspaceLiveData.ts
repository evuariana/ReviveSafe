import { useMemo } from "react";
import { useAccount } from "@luno-kit/react";
import { create } from "zustand";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";

interface WorkspaceLiveDataStore {
  enabledSessions: Record<string, true>;
  enableSession: (key: string) => void;
  disableSession: (key: string) => void;
}

const useWorkspaceLiveDataStore = create<WorkspaceLiveDataStore>((set) => ({
  disableSession: (key) =>
    set((state) => {
      const nextEnabledSessions = { ...state.enabledSessions };
      delete nextEnabledSessions[key];

      return {
        enabledSessions: nextEnabledSessions,
      };
    }),
  enableSession: (key) =>
    set((state) => ({
      enabledSessions: {
        ...state.enabledSessions,
        [key]: true,
      },
    })),
  enabledSessions: {},
}));

export function useWorkspaceLiveData() {
  const { account } = useAccount();
  const { chain } = usePolkadotClient();
  const enabledSessions = useWorkspaceLiveDataStore(
    (state) => state.enabledSessions
  );
  const enableSession = useWorkspaceLiveDataStore((state) => state.enableSession);
  const disableSession = useWorkspaceLiveDataStore((state) => state.disableSession);
  const sessionKey = useMemo(
    () =>
      account?.address
        ? `${chain.key}:${account.address.toLowerCase()}`
        : undefined,
    [account?.address, chain.key]
  );

  return {
    canLoad: !!account?.address,
    disable: () => {
      if (sessionKey) {
        disableSession(sessionKey);
      }
    },
    enable: () => {
      if (sessionKey) {
        enableSession(sessionKey);
      }
    },
    enabled: sessionKey ? Boolean(enabledSessions[sessionKey]) : false,
  };
}

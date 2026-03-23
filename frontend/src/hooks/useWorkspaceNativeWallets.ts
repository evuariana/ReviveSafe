import { create } from "zustand";

import type {
  ImportedNativeWalletRecord,
  NativeWorkspaceEvent,
  SupportedHubChain,
} from "@/types/revive";

const STORAGE_KEY = "revivesafe.nativeWorkspace";

interface NativeWorkspaceStore {
  events: NativeWorkspaceEvent[];
  hydrated: boolean;
  hydrate: () => void;
  recordEvent: (event: Omit<NativeWorkspaceEvent, "id">) => void;
  removeWallet: (chainKey: SupportedHubChain, accountIdHex: string) => void;
  upsertWallet: (wallet: ImportedNativeWalletRecord) => void;
  wallets: ImportedNativeWalletRecord[];
}

function parseStoredState(raw: string | null) {
  if (!raw) {
    return {
      events: [] as NativeWorkspaceEvent[],
      wallets: [] as ImportedNativeWalletRecord[],
    };
  }

  try {
    const parsed = JSON.parse(raw) as {
      events?: NativeWorkspaceEvent[];
      wallets?: ImportedNativeWalletRecord[];
    };

    return {
      events: Array.isArray(parsed.events) ? parsed.events : [],
      wallets: Array.isArray(parsed.wallets) ? parsed.wallets : [],
    };
  } catch {
    return {
      events: [] as NativeWorkspaceEvent[],
      wallets: [] as ImportedNativeWalletRecord[],
    };
  }
}

function persistState(
  wallets: ImportedNativeWalletRecord[],
  events: NativeWorkspaceEvent[]
) {
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      events,
      wallets,
    })
  );
}

export const useWorkspaceNativeWallets = create<NativeWorkspaceStore>(
  (set, get) => ({
    events: [],
    hydrated: false,
    hydrate: () => {
      const stored = parseStoredState(window.localStorage.getItem(STORAGE_KEY));

      set({
        events: stored.events,
        hydrated: true,
        wallets: stored.wallets,
      });
    },
    recordEvent: (event) => {
      const nextEvent: NativeWorkspaceEvent = {
        ...event,
        id: `${event.kind}-${event.walletAccountIdHex}-${event.createdAt}-${Math.random()
          .toString(16)
          .slice(2, 8)}`,
      };
      const state = get();
      const events = [nextEvent, ...state.events].slice(0, 200);

      persistState(state.wallets, events);
      set({ events });
    },
    removeWallet: (chainKey, accountIdHex) => {
      const state = get();
      const wallets = state.wallets.filter(
        (wallet) =>
          !(
            wallet.chainKey === chainKey &&
            wallet.accountIdHex.toLowerCase() === accountIdHex.toLowerCase()
          )
      );

      persistState(wallets, state.events);
      set({ wallets });
    },
    upsertWallet: (wallet) => {
      const state = get();
      const existing = state.wallets.find(
        (entry) =>
          entry.chainKey === wallet.chainKey &&
          entry.accountIdHex.toLowerCase() === wallet.accountIdHex.toLowerCase()
      );

      const nextWallet = existing
        ? {
            ...existing,
            ...wallet,
            importedAt: existing.importedAt,
          }
        : wallet;
      const wallets = [
        nextWallet,
        ...state.wallets.filter(
          (entry) =>
            !(
              entry.chainKey === wallet.chainKey &&
              entry.accountIdHex.toLowerCase() === wallet.accountIdHex.toLowerCase()
            )
        ),
      ];

      persistState(wallets, state.events);
      set({ wallets });

      if (!existing) {
        get().recordEvent({
          chainKey: wallet.chainKey,
          createdAt: Date.now(),
          description: `${wallet.threshold} of ${wallet.members.length} native multisig imported into this workspace.`,
          kind: "wallet_imported",
          title: wallet.name || "Native wallet imported",
          walletAccountIdHex: wallet.accountIdHex,
          walletAddress: wallet.address,
        });
      }
    },
    wallets: [],
  })
);

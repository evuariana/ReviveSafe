import { createContext, useContext, useState, type ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LunoKitProvider } from "@luno-kit/ui";

import { walletConfig } from "@/config/wallet";

const LunoKitAvailableContext = createContext(false);

export function useLunoKitAvailable(): boolean {
  return useContext(LunoKitAvailableContext);
}

const lunoTheme = {
  autoMode: true,
  light: {
    colors: {
      accentColor: "#ff4d6d",
      connectButtonBackground: "#111827",
      connectButtonInnerBackground: "#111827",
      connectButtonText: "#ffffff",
      modalBackground: "#ffffff",
      modalBackdrop: "rgba(15, 23, 42, 0.55)",
      modalBorder: "#e2e8f0",
      modalText: "#0f172a",
      modalTextSecondary: "#64748b",
      walletSelectItemBackground: "#f8fafc",
      walletSelectItemBackgroundHover: "#e2e8f0",
      walletSelectItemText: "#0f172a",
      separatorLine: "#e2e8f0",
    },
    radii: {
      modal: "18px",
      connectButton: "12px",
      walletSelectItem: "12px",
    },
  },
  dark: {
    colors: {
      accentColor: "#fb7185",
      connectButtonBackground: "#0f172a",
      connectButtonInnerBackground: "#0f172a",
      connectButtonText: "#ffffff",
      modalBackground: "#020617",
      modalBackdrop: "rgba(2, 6, 23, 0.75)",
      modalBorder: "#1e293b",
      modalText: "#f8fafc",
      modalTextSecondary: "#94a3b8",
      walletSelectItemBackground: "#0f172a",
      walletSelectItemBackgroundHover: "#1e293b",
      walletSelectItemText: "#f8fafc",
      separatorLine: "#1e293b",
    },
    radii: {
      modal: "18px",
      connectButton: "12px",
      walletSelectItem: "12px",
    },
  },
} as const;

export function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LunoKitProvider config={walletConfig} theme={lunoTheme}>
        <LunoKitAvailableContext.Provider value>
          {children}
        </LunoKitAvailableContext.Provider>
      </LunoKitProvider>
    </QueryClientProvider>
  );
}


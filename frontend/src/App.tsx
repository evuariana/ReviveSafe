import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { router } from "@/lib/router";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useWorkspaceNativeWallets } from "@/hooks/useWorkspaceNativeWallets";
import { PolkadotClientProvider } from "@/providers/polkadot-client";
import { WalletProvider } from "@/providers/wallet-provider";

function AppRouter() {
  const hydrateFactoryAddress = useFactoryAddress((state) => state.hydrate);
  const hydrateNativeWorkspace = useWorkspaceNativeWallets(
    (state) => state.hydrate
  );

  useEffect(() => {
    hydrateFactoryAddress();
    hydrateNativeWorkspace();
  }, [hydrateFactoryAddress, hydrateNativeWorkspace]);

  return (
    <PolkadotClientProvider>
      <RouterProvider router={router} />
    </PolkadotClientProvider>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppRouter />
    </WalletProvider>
  );
}

export default App;

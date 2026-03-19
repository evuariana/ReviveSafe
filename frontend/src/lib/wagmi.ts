// src/lib/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";
import { POLKADOT_HUB_TESTNET } from "@/config/constants";

export const polkadotTestnet = defineChain({
  id: POLKADOT_HUB_TESTNET.chainId,
  name: POLKADOT_HUB_TESTNET.name,
  nativeCurrency: {
    decimals: 18,
    name: "Paseo",
    symbol: POLKADOT_HUB_TESTNET.symbol,
  },
  rpcUrls: {
    default: {
      http: [POLKADOT_HUB_TESTNET.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: POLKADOT_HUB_TESTNET.explorerUrl,
    },
  },
});

export const config = getDefaultConfig({
  appName: "ReviveSafe",
  projectId:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID ??
    "revivesafe-hackathon-demo",
  chains: [polkadotTestnet],
  ssr: false,
});

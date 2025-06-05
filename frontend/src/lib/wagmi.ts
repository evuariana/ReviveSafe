// src/lib/wagmi.ts
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

// Define Polkadot/Paseo testnet (adjust these values for your specific network)
export const polkadotTestnet = defineChain({
  id: 420420421, // Replace with actual chain ID
  name: "Westend Testnet", // Replace with actual chain name
  nativeCurrency: {
    decimals: 18,
    name: "Westend",
    symbol: "WND", // Replace with actual symbol
  },
  rpcUrls: {
    default: {
      http: ["https://westend-asset-hub-eth-rpc.polkadot.io"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://blockscout-asset-hub.parity-chains-scw.parity.io",
    },
  },
});

export const config = getDefaultConfig({
  appName: "ReviveSafe",
  projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get from https://cloud.walletconnect.com
  chains: [polkadotTestnet],
  ssr: false,
});

export const FACTORY_ADDRESS =
  "637305b4d1950c1852cb656ab4c1416ed421fddb" as const;
export const MULTISIG_ADDRESSES = [
  "113d51409e227ef8b1bd4c4a26ac4bebae7c4e79",
  // Add more multisig addresses as needed
] as const;

import { isAddress, type Address } from "viem";

const rawFactoryAddress = import.meta.env.VITE_FACTORY_ADDRESS;

export const POLKADOT_HUB_TESTNET = {
  chainId: 420420417,
  name: "Polkadot Hub TestNet",
  symbol: "PAS",
  rpcUrl:
    import.meta.env.VITE_POLKADOT_RPC_URL ??
    "https://services.polkadothub-rpc.com/testnet",
  wsUrl:
    import.meta.env.VITE_POLKADOT_WS_URL ??
    "wss://asset-hub-paseo-rpc.n.dwellir.com",
  explorerUrl:
    import.meta.env.VITE_BLOCK_EXPLORER_URL ??
    "https://blockscout-testnet.polkadot.io",
} as const;

export const FACTORY_ADDRESS: Address | undefined =
  typeof rawFactoryAddress === "string" && isAddress(rawFactoryAddress)
    ? (rawFactoryAddress as Address)
    : undefined;

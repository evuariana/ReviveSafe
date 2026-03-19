import type { HubChainConfig, SupportedHubChain } from "@/types/revive";

const paseoEthRpcUrl =
  import.meta.env.VITE_PASEO_ETH_RPC_URL ??
  "https://services.polkadothub-rpc.com/testnet";
const paseoWsUrl =
  import.meta.env.VITE_PASEO_WS_URL ??
  "wss://asset-hub-paseo-rpc.n.dwellir.com";
const paseoExplorerUrl =
  import.meta.env.VITE_PASEO_EXPLORER_URL ??
  "https://blockscout-asset-hub-paseo.parity-testnet.parity.io";

const polkadotAssetHubEthRpcUrl =
  import.meta.env.VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL ??
  "https://polkadot-asset-hub-eth-rpc.polkadot.io";
const polkadotAssetHubWsUrl =
  import.meta.env.VITE_POLKADOT_ASSET_HUB_WS_URL ??
  "wss://polkadot-asset-hub-rpc.polkadot.io";
const polkadotAssetHubExplorerUrl =
  import.meta.env.VITE_POLKADOT_ASSET_HUB_EXPLORER_URL ??
  "https://assethub-polkadot.subscan.io";

export const HUB_NETWORKS: Record<SupportedHubChain, HubChainConfig> = {
  paseoAssetHub: {
    key: "paseoAssetHub",
    name: "Paseo Asset Hub",
    symbol: "PAS",
    testnet: true,
    ethRpcUrl: paseoEthRpcUrl,
    wsUrl: paseoWsUrl,
    explorerUrl: paseoExplorerUrl,
    chainNameMatch: "Paseo Asset Hub",
  },
  polkadotAssetHub: {
    key: "polkadotAssetHub",
    name: "Polkadot Asset Hub",
    symbol: "DOT",
    testnet: false,
    ethRpcUrl: polkadotAssetHubEthRpcUrl,
    wsUrl: polkadotAssetHubWsUrl,
    explorerUrl: polkadotAssetHubExplorerUrl,
    chainNameMatch: "Polkadot Asset Hub",
  },
};

export const DEFAULT_HUB_CHAIN = HUB_NETWORKS.paseoAssetHub;

export function getHubChainByName(name?: string | null): HubChainConfig {
  if (!name) {
    return DEFAULT_HUB_CHAIN;
  }

  return (
    Object.values(HUB_NETWORKS).find((chain) =>
      name.toLowerCase().includes(chain.chainNameMatch.toLowerCase())
    ) ?? DEFAULT_HUB_CHAIN
  );
}


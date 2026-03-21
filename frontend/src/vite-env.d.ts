/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FACTORY_ADDRESS?: string;
  readonly VITE_PASEO_ETH_RPC_URL?: string;
  readonly VITE_PASEO_WS_URL?: string;
  readonly VITE_PASEO_EXPLORER_URL?: string;
  readonly VITE_POLKADOT_ASSET_HUB_ETH_RPC_URL?: string;
  readonly VITE_POLKADOT_ASSET_HUB_WS_URL?: string;
  readonly VITE_POLKADOT_ASSET_HUB_EXPLORER_URL?: string;
  readonly VITE_REPOSITORY_URL?: string;
  readonly VITE_BETA_SUPPORT_URL?: string;
  readonly VITE_BETA_SUPPORT_LABEL?: string;
  readonly VITE_RELEASE_CHANNEL?: string;
  readonly VITE_OBSERVABILITY_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

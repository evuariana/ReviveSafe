import { createContext } from "react";
import type { DedotClient } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";
import type { HubChainConfig } from "@/types/revive";

export interface PolkadotClientValue {
  client: DedotClient<PolkadotApi> | null;
  loading: boolean;
  error?: string;
  chain: HubChainConfig;
}

export const PolkadotClientContext = createContext<PolkadotClientValue>({
  client: null,
  loading: true,
  error: undefined,
  chain: {
    key: "paseoAssetHub",
    name: "Paseo Asset Hub",
    symbol: "PAS",
    testnet: true,
    ethRpcUrl: "",
    wsUrl: "",
    explorerUrl: "",
    chainNameMatch: "Paseo Asset Hub",
  },
});

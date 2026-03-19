import { createContext } from "react";
import type { DedotClient } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";

export interface PolkadotClientValue {
  client: DedotClient<PolkadotApi> | null;
  loading: boolean;
}

export const PolkadotClientContext = createContext<PolkadotClientValue>({
  client: null,
  loading: true,
});

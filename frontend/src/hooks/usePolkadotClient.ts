import { useContext } from "react";
import { PolkadotClientContext } from "@/providers/polkadot-client-context";

export function usePolkadotClient() {
  return useContext(PolkadotClientContext);
}

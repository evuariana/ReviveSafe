import { createConfig } from "@luno-kit/react";
import { paseoAssetHub, polkadotAssetHub } from "@luno-kit/react/chains";
import {
  polkadotjsConnector,
  subwalletConnector,
  talismanConnector,
} from "@luno-kit/react/connectors";

export const walletConfig = createConfig({
  appName: "ReviveSafe",
  chains: [paseoAssetHub, polkadotAssetHub],
  connectors: [
    talismanConnector(),
    subwalletConnector(),
    polkadotjsConnector(),
  ],
});


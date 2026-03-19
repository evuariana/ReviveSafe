import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";
import { useChain } from "@luno-kit/react";

import { DEFAULT_HUB_CHAIN, getHubChainByName } from "@/config/hubs";
import { PolkadotClientContext } from "@/providers/polkadot-client-context";

export function PolkadotClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client, setClient] = useState<DedotClient<PolkadotApi> | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<DedotClient<PolkadotApi> | null>(null);
  const { chain: activeChain } = useChain();
  const chain = getHubChainByName(activeChain?.name ?? DEFAULT_HUB_CHAIN.name);

  useEffect(() => {
    let cancelled = false;
    const previousClient = clientRef.current;
    clientRef.current = null;

    const connect = async () => {
      setLoading(true);
      setClient(null);

      try {
        if (previousClient) {
          previousClient.disconnect().catch(() => undefined);
        }

        const nextClient = await DedotClient.new<PolkadotApi>(
          new WsProvider(chain.wsUrl)
        );

        if (cancelled) {
          await nextClient.disconnect().catch(() => undefined);
          return;
        }

        clientRef.current = nextClient;
        setClient(nextClient);
      } catch (error) {
        console.error("Failed to connect to Polkadot Hub WebSocket", error);
        setClient(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    connect();

    return () => {
      cancelled = true;
      const activeClient = clientRef.current;
      clientRef.current = null;
      if (activeClient) {
        activeClient.disconnect().catch(() => undefined);
      }
    };
  }, [chain.wsUrl]);

  return (
    <PolkadotClientContext.Provider value={{ client, loading, chain }}>
      {children}
    </PolkadotClientContext.Provider>
  );
}

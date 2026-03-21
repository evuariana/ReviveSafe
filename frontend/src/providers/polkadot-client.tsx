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
import { reportOperationalEvent } from "@/lib/observability";
import { PolkadotClientContext } from "@/providers/polkadot-client-context";

export function PolkadotClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client, setClient] = useState<DedotClient<PolkadotApi> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
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
      setError(undefined);

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
        reportOperationalEvent({
          type: "runtime.connection.error",
          level: "error",
          message:
            error instanceof Error
              ? error.message
              : "Failed to connect to the active runtime.",
          details: {
            chain: chain.name,
            wsUrl: chain.wsUrl,
          },
        });
        setClient(null);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to connect to the active runtime."
        );
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
  }, [chain.name, chain.wsUrl]);

  return (
    <PolkadotClientContext.Provider value={{ client, loading, error, chain }}>
      {children}
    </PolkadotClientContext.Provider>
  );
}

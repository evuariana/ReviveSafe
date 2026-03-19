import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";
import { POLKADOT_HUB_TESTNET } from "@/config/constants";
import { PolkadotClientContext } from "@/providers/polkadot-client-context";

export function PolkadotClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [client, setClient] = useState<DedotClient<PolkadotApi> | null>(null);
  const [loading, setLoading] = useState(true);
  const clientRef = useRef<DedotClient<PolkadotApi> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const connect = async () => {
      setLoading(true);

      try {
        const nextClient = await DedotClient.new<PolkadotApi>(
          new WsProvider(POLKADOT_HUB_TESTNET.wsUrl)
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
  }, []);

  return (
    <PolkadotClientContext.Provider value={{ client, loading }}>
      {children}
    </PolkadotClientContext.Provider>
  );
}

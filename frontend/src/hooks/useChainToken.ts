import { useEffect, useState } from "react";

import type { ChainTokenInfo } from "@/types/revive";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";

const DEFAULT_CHAIN_TOKEN: Omit<ChainTokenInfo, "loading"> = {
  symbol: "UNIT",
  decimals: 10,
  existentialDeposit: 0n,
};

export function useChainToken(): ChainTokenInfo {
  const { client, loading: clientLoading, chain } = usePolkadotClient();
  const [tokenInfo, setTokenInfo] =
    useState<Omit<ChainTokenInfo, "loading">>(DEFAULT_CHAIN_TOKEN);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client) {
      setTokenInfo((previous) => ({
        ...previous,
        symbol: chain.symbol,
      }));
      setLoading(clientLoading);
      return;
    }

    let cancelled = false;

    const load = async () => {
      setLoading(true);

      try {
        const properties = await client.chainSpec.properties();
        const tokenDecimals = Array.isArray(properties.tokenDecimals)
          ? properties.tokenDecimals[0]
          : properties.tokenDecimals;
        const tokenSymbol = Array.isArray(properties.tokenSymbol)
          ? properties.tokenSymbol[0]
          : properties.tokenSymbol;

        if (!cancelled) {
          setTokenInfo({
            symbol: tokenSymbol ?? chain.symbol,
            decimals: tokenDecimals ?? 10,
            existentialDeposit: BigInt(
              client.consts.balances.existentialDeposit.toString()
            ),
          });
        }
      } catch (error) {
        console.error("Failed to load chain token info", error);
        if (!cancelled) {
          setTokenInfo((previous) => ({
            ...previous,
            symbol: chain.symbol,
          }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [chain.symbol, client, clientLoading]);

  return {
    ...tokenInfo,
    loading,
  };
}


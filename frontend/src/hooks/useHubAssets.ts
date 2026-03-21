import { useQuery } from "@tanstack/react-query";
import type { DedotClient } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { assetIdToPrecompileAddress } from "@/lib/precompiles";
import type { HubAsset } from "@/types/revive";

const MAX_DISCOVERED_HUB_ASSETS = 128;

function bytesToText(bytes: number[] | Uint8Array | undefined): string {
  if (!bytes || bytes.length === 0) {
    return "";
  }

  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "";
  }
}

function hasAssetsMetadata(
  client: DedotClient<PolkadotApi> | null
): client is DedotClient<PolkadotApi> & {
  query: {
    assets: {
      metadata: {
        entries: () => Promise<[unknown, unknown][]>;
      };
    };
  };
} {
  const metadata = client?.query?.assets?.metadata as unknown as
    | {
        entries?: () => Promise<[unknown, unknown][]>;
      }
    | undefined;

  return typeof metadata?.entries === "function";
}

async function fetchHubAssets(
  client: DedotClient<PolkadotApi> | null
): Promise<HubAsset[]> {
  if (!hasAssetsMetadata(client)) {
    return [];
  }

  try {
    const metadata = client.query.assets.metadata as unknown as {
      entries: () => Promise<[unknown, unknown][]>;
    };
    const entries = (await metadata.entries()) as [
      unknown,
      unknown,
    ][];

    const assets = entries
      .map(([key, metadata]) => {
        const assetId = Number(Array.isArray(key) ? key[0] : key);
        if (!Number.isInteger(assetId)) {
          return null;
        }

        const typedMetadata = metadata as {
          name?: string | number[] | Uint8Array;
          symbol?: string | number[] | Uint8Array;
          decimals?: number;
        };

        return {
          id: assetId,
          name:
            bytesToText(typedMetadata.name as number[] | Uint8Array) ||
            `Asset #${assetId}`,
          symbol: bytesToText(typedMetadata.symbol as number[] | Uint8Array),
          decimals: Number(typedMetadata.decimals ?? 0),
          precompileAddress: assetIdToPrecompileAddress(assetId),
        } satisfies HubAsset;
      })
      .filter((asset): asset is HubAsset => asset !== null)
      .sort((left, right) => left.id - right.id);

    return assets.slice(0, MAX_DISCOVERED_HUB_ASSETS);
  } catch (error) {
    console.error("Failed to fetch assets metadata", error);
    throw new Error("Failed to fetch Asset Hub asset metadata.");
  }
}

export function useHubAssets() {
  const { client, loading, chain } = usePolkadotClient();

  return useQuery({
    queryKey: ["hub-assets", chain.key],
    enabled: !loading,
    staleTime: 5 * 60 * 1000,
    queryFn: () => fetchHubAssets(client),
  });
}

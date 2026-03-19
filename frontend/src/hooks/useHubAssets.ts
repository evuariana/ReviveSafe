import { useQuery } from "@tanstack/react-query";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import {
  KNOWN_HUB_ASSETS,
  type HubAsset,
  assetIdToPrecompileAddress,
} from "@/lib/precompiles";

function bytesToName(bytes: number[] | Uint8Array | undefined): string {
  if (!bytes || bytes.length === 0) {
    return "";
  }

  try {
    return new TextDecoder().decode(new Uint8Array(bytes));
  } catch {
    return "";
  }
}

async function fetchKnownHubAssets(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  client: any
): Promise<HubAsset[]> {
  if (!client?.query?.assets?.metadata) {
    return KNOWN_HUB_ASSETS;
  }

  try {
    const metadataEntries = await client.query.assets.metadata.entries();
    const metadataMap = new Map<
      number,
      { name: string; symbol: string; decimals: number }
    >();

    for (const entry of metadataEntries as [unknown, unknown][]) {
      const [key, meta] = entry;
      const id = typeof key === "number" ? key : Number(key);
      const typedMeta = meta as {
        name?: string | number[] | Uint8Array;
        symbol?: string | number[] | Uint8Array;
        decimals?: number;
      };

      metadataMap.set(id, {
        name: bytesToName(typedMeta.name as number[] | Uint8Array) || `Asset #${id}`,
        symbol: bytesToName(typedMeta.symbol as number[] | Uint8Array),
        decimals: Number(typedMeta.decimals ?? 0),
      });
    }

    return KNOWN_HUB_ASSETS.map((asset) => {
      const metadata = metadataMap.get(asset.id);
      if (!metadata) {
        return asset;
      }

      return {
        id: asset.id,
        precompileAddress: assetIdToPrecompileAddress(asset.id),
        name: metadata.name || asset.name,
        symbol: metadata.symbol || asset.symbol,
        decimals: metadata.decimals || asset.decimals,
      };
    });
  } catch (error) {
    console.error("Falling back to bundled asset metadata", error);
    return KNOWN_HUB_ASSETS;
  }
}

export function useHubAssets() {
  const { client, loading } = usePolkadotClient();

  return useQuery({
    queryKey: ["hub-assets"],
    queryFn: () => fetchKnownHubAssets(client),
    enabled: !loading,
    staleTime: 5 * 60 * 1000,
    initialData: KNOWN_HUB_ASSETS,
  });
}

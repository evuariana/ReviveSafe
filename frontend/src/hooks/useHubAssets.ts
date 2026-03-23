import { useQuery } from "@tanstack/react-query";
import type { DedotClient } from "dedot";
import type { PolkadotApi } from "@dedot/chaintypes";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import {
  buildHubAssetMetadataPrefix,
  decodeAssetIdFromMetadataStorageKey,
} from "@/lib/hub-assets";
import { assetIdToPrecompileAddress } from "@/lib/precompiles";
import type { HubAsset } from "@/types/revive";

const MAX_DISCOVERED_HUB_ASSETS = 128;
const MAX_DISCOVERED_HUB_ASSET_KEYS = 4096;
const HUB_ASSET_KEY_PAGE_SIZE = 256;

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
    const metadataQuery = client.query.assets.metadata as unknown as ((
      assetId: number
    ) => Promise<{
      name?: string | number[] | Uint8Array;
      symbol?: string | number[] | Uint8Array;
      decimals?: number;
    }>) & {
      entries: () => Promise<[unknown, unknown][]>;
    };
    const assetIds = new Set<number>();
    const prefix = buildHubAssetMetadataPrefix();
    let startKey: string = prefix;
    let scannedKeys = 0;

    while (scannedKeys < MAX_DISCOVERED_HUB_ASSET_KEYS) {
      const remainingKeys = MAX_DISCOVERED_HUB_ASSET_KEYS - scannedKeys;
      const pageSize = Math.min(HUB_ASSET_KEY_PAGE_SIZE, remainingKeys);
      const keys = (await client.provider.send("state_getKeysPaged", [
        prefix,
        pageSize,
        startKey,
      ])) as string[];

      if (!Array.isArray(keys) || keys.length === 0) {
        break;
      }

      keys.forEach((key) => {
        const assetId = decodeAssetIdFromMetadataStorageKey(key);
        if (assetId !== null) {
          assetIds.add(assetId);
        }
      });

      scannedKeys += keys.length;
      startKey = keys[keys.length - 1];

      if (keys.length < pageSize) {
        break;
      }
    }

    const selectedAssetIds = [...assetIds]
      .sort((left, right) => left - right)
      .slice(0, MAX_DISCOVERED_HUB_ASSETS);

    const metadataEntries = await Promise.all(
      selectedAssetIds.map((assetId) => metadataQuery(assetId))
    );

    const assets = selectedAssetIds
      .map((assetId, index) => {
        const typedMetadata = metadataEntries[index] as {
          name?: string | number[] | Uint8Array;
          symbol?: string | number[] | Uint8Array;
          decimals?: number;
        };

        return {
          id: assetId,
          name:
            bytesToText(typedMetadata?.name as number[] | Uint8Array) ||
            `Asset #${assetId}`,
          symbol: bytesToText(typedMetadata?.symbol as number[] | Uint8Array),
          decimals: Number(typedMetadata?.decimals ?? 0),
          precompileAddress: assetIdToPrecompileAddress(assetId),
        } satisfies HubAsset;
      })
      .sort((left, right) => left.id - right.id);

    return assets;
  } catch (error) {
    console.error("Failed to fetch assets metadata", error);
    throw new Error("Failed to fetch Asset Hub asset metadata.");
  }
}

interface UseHubAssetsOptions {
  enabled?: boolean;
}

export function useHubAssets(options: UseHubAssetsOptions = {}) {
  const { client, loading, chain } = usePolkadotClient();

  return useQuery({
    queryKey: ["hub-assets", chain.key],
    enabled: (options.enabled ?? true) && !loading,
    staleTime: 5 * 60 * 1000,
    queryFn: () => fetchHubAssets(client),
  });
}

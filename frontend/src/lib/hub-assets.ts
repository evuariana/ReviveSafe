import { bytesToHex, hexToBytes, type Hex } from "viem";
import { stringToU8a, twox128 } from "dedot/utils";

const ASSETS_METADATA_PREFIX = bytesToHex(
  new Uint8Array([
    ...twox128(stringToU8a("Assets")),
    ...twox128(stringToU8a("Metadata")),
  ])
) as Hex;

const METADATA_STORAGE_KEY_LENGTH = 52;
const SCALE_U32_LENGTH = 4;

export function buildHubAssetMetadataPrefix(): Hex {
  return ASSETS_METADATA_PREFIX;
}

export function decodeAssetIdFromMetadataStorageKey(
  key: string
): number | null {
  if (
    typeof key !== "string" ||
    !key.startsWith(ASSETS_METADATA_PREFIX) ||
    key.length !== 2 + METADATA_STORAGE_KEY_LENGTH * 2
  ) {
    return null;
  }

  const bytes = hexToBytes(key as Hex);
  const assetIdOffset = bytes.length - SCALE_U32_LENGTH;
  const assetId =
    bytes[assetIdOffset] |
    (bytes[assetIdOffset + 1] << 8) |
    (bytes[assetIdOffset + 2] << 16) |
    (bytes[assetIdOffset + 3] << 24);

  return assetId >>> 0;
}

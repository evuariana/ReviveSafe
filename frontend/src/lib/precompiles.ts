import {
  decodeFunctionData,
  encodeFunctionData,
  type Address,
  type Hex,
} from "viem";
import { erc20PrecompileAbi } from "@/config/contracts";

const ERC20_PRECOMPILE_SUFFIX = 0x01200000n;
const ASSET_ID_SHIFT = 128n;

export interface HubAsset {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  precompileAddress: Address;
}

const DEFAULT_HUB_ASSET_SEEDS = [
  { id: 1984, name: "Tether USD", symbol: "USDT", decimals: 6 },
  { id: 1337, name: "USD Coin", symbol: "USDC", decimals: 6 },
] as const;

export const KNOWN_HUB_ASSETS: HubAsset[] = DEFAULT_HUB_ASSET_SEEDS.map(
  (asset) => ({
    ...asset,
    precompileAddress: assetIdToPrecompileAddress(asset.id),
  })
);

export function assetIdToPrecompileAddress(assetId: number): Address {
  const value =
    (BigInt(assetId) << ASSET_ID_SHIFT) | ERC20_PRECOMPILE_SUFFIX;
  return `0x${value.toString(16).padStart(40, "0")}` as Address;
}

export function precompileAddressToAssetId(address: Address): number | null {
  const normalized = address.toLowerCase().replace(/^0x/, "");
  if (!normalized.endsWith("01200000")) {
    return null;
  }

  const middleBytes = normalized.slice(8, 32);
  if (middleBytes !== "000000000000000000000000") {
    return null;
  }

  return Number.parseInt(normalized.slice(0, 8), 16);
}

export function encodeAssetTransferCall(
  destination: Address,
  amount: bigint
): Hex {
  return encodeFunctionData({
    abi: erc20PrecompileAbi,
    functionName: "transfer",
    args: [destination, amount],
  });
}

export function decodeAssetTransferCall(destination: Address, data: Hex) {
  const assetId = precompileAddressToAssetId(destination);
  if (assetId === null) {
    return null;
  }

  try {
    const decoded = decodeFunctionData({
      abi: erc20PrecompileAbi,
      data,
    });

    if (decoded.functionName !== "transfer") {
      return null;
    }

    const [recipient, amount] = decoded.args as [Address, bigint];

    return {
      assetId,
      amount,
      recipient,
      asset: getHubAssetById(assetId),
    };
  } catch {
    return null;
  }
}

export function getHubAssetById(assetId: number): HubAsset | undefined {
  return KNOWN_HUB_ASSETS.find((asset) => asset.id === assetId);
}

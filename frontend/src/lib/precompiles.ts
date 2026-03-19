import {
  decodeFunctionData,
  encodeFunctionData,
  type Address,
  type Hex,
} from "viem";

import { erc20PrecompileAbi } from "@/config/contracts";
import type { HubAsset } from "@/types/revive";

const ERC20_PRECOMPILE_SUFFIX = 0x01200000n;
const ASSET_ID_SHIFT = 128n;

export function assetIdToPrecompileAddress(assetId: number): Address {
  const value = (BigInt(assetId) << ASSET_ID_SHIFT) | ERC20_PRECOMPILE_SUFFIX;
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
    };
  } catch {
    return null;
  }
}

export function findHubAssetById(
  assets: HubAsset[],
  assetId: number
): HubAsset | undefined {
  return assets.find((asset) => asset.id === assetId);
}

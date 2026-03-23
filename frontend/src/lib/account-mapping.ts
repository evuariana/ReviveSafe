import { decodeAddress } from "dedot/utils";
import {
  bytesToHex,
  getAddress,
  hexToBytes,
  isAddress,
  keccak256,
  type Address,
  type Hex,
} from "viem";

import type { MappingStatus } from "@/types/revive";

const ETH_DERIVED_SUFFIX = new Uint8Array(12).fill(0xee);

function toHex32(bytes: Uint8Array): Hex {
  return bytesToHex(bytes) as Hex;
}

export function decodeAccountId32(address: string): Uint8Array {
  if (isAddress(address)) {
    return hexToBytes(h160ToFallbackAccountId32(getAddress(address)));
  }

  return Uint8Array.from(decodeAddress(address));
}

export function isEthDerivedAccountId32(accountId32: Uint8Array): boolean {
  if (accountId32.length !== 32) {
    return false;
  }

  return ETH_DERIVED_SUFFIX.every((byte, index) => accountId32[20 + index] === byte);
}

export function deriveMappedH160(accountId32: Uint8Array): Address {
  if (accountId32.length !== 32) {
    throw new Error("Expected a 32-byte account ID");
  }

  if (isEthDerivedAccountId32(accountId32)) {
    return getAddress(bytesToHex(accountId32.slice(0, 20)));
  }

  const hash = hexToBytes(keccak256(accountId32));
  return getAddress(bytesToHex(hash.slice(12)));
}

export function h160ToFallbackAccountId32(address: Address): Hex {
  const addressBytes = hexToBytes(address);
  const accountId = new Uint8Array(32);
  accountId.set(addressBytes, 0);
  accountId.set(ETH_DERIVED_SUFFIX, 20);
  return toHex32(accountId);
}

export function normalizeAccountId32(value: unknown): Hex | null {
  if (!value) {
    return null;
  }

  const fromString = (stringValue: string): Hex | null => {
    if (stringValue.startsWith("0x") && stringValue.length === 66) {
      return stringValue as Hex;
    }

    try {
      return toHex32(decodeAccountId32(stringValue));
    } catch {
      return null;
    }
  };

  if (typeof value === "string") {
    return fromString(value);
  }

  if (value instanceof Uint8Array) {
    return value.length === 32 ? toHex32(value) : null;
  }

  if (Array.isArray(value)) {
    const bytes = Uint8Array.from(value);
    return bytes.length === 32 ? toHex32(bytes) : null;
  }

  if (
    typeof value === "object" &&
    value !== null
  ) {
    if ("raw" in value && typeof value.raw === "string") {
      return fromString(value.raw);
    }

    if ("address" in value && typeof value.address === "string") {
      return fromString(value.address);
    }

    if ("toJSON" in value && typeof value.toJSON === "function") {
      const jsonValue = value.toJSON();
      const normalizedJson = normalizeAccountId32(jsonValue);
      if (normalizedJson) {
        return normalizedJson;
      }
    }

    if ("toString" in value && typeof value.toString === "function") {
      return fromString(value.toString());
    }
  }

  return null;
}

export function deriveMappingStatus(address: string): MappingStatus {
  const accountId32 = decodeAccountId32(address);
  const mappedH160 = deriveMappedH160(accountId32);

  return {
    ss58Address: address,
    mappedH160,
    fallbackAccountId32: h160ToFallbackAccountId32(mappedH160),
    isEthDerived: isEthDerivedAccountId32(accountId32),
    isMapped: false,
    sourceAccountId32: toHex32(accountId32),
  };
}

export function isOriginalAccountMappingUsable(
  mapping: MappingStatus,
  originalAccount: unknown
) {
  if (mapping.isEthDerived) {
    return true;
  }

  return normalizeAccountId32(originalAccount) === mapping.sourceAccountId32;
}

export function isH160Address(value: string): value is Address {
  return isAddress(value);
}

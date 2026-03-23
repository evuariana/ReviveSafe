import { blake2AsU8a, decodeAddress, encodeAddress } from "dedot/utils";
import { bytesToHex, hexToBytes, type Hex } from "viem";

const MULTISIG_PREFIX = new TextEncoder().encode("modlpy/utilisuba");

function compactToU8a(value: number): Uint8Array {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error("Compact encoding expects a non-negative integer.");
  }

  if (value < 1 << 6) {
    return Uint8Array.from([value << 2]);
  }

  if (value < 1 << 14) {
    return Uint8Array.from([(value << 2) | 0x01, value >> 6]);
  }

  if (value < 1 << 30) {
    return Uint8Array.from([
      (value << 2) | 0x02,
      value >> 6,
      value >> 14,
      value >> 22,
    ]);
  }

  throw new Error("Compact encoding for large multisig sizes is not supported.");
}

function concatBytes(...parts: Uint8Array[]) {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }

  return result;
}

function thresholdToLeU16(threshold: number) {
  if (!Number.isInteger(threshold) || threshold <= 0 || threshold > 0xffff) {
    throw new Error("Threshold must fit within an unsigned 16-bit integer.");
  }

  return Uint8Array.from([threshold & 0xff, threshold >> 8]);
}

export function accountIdBytes(address: string) {
  return Uint8Array.from(decodeAddress(address));
}

export function accountIdHex(address: string): Hex {
  return bytesToHex(accountIdBytes(address)) as Hex;
}

export function encodeAccountId(account: Hex, ss58Prefix = 0) {
  return encodeAddress(hexToBytes(account), ss58Prefix);
}

export function addressEquals(left: string, right: string) {
  return accountIdHex(left) === accountIdHex(right);
}

export function sortMultisigMembers(
  members: string[],
  ss58Prefix = 0
): { accountIdHex: Hex; address: string }[] {
  return members
    .map((member) => {
      const raw = accountIdBytes(member);

      return {
        address: encodeAddress(raw, ss58Prefix),
        accountIdHex: bytesToHex(raw) as Hex,
        raw,
      };
    })
    .sort((left, right) => Buffer.compare(Buffer.from(left.raw), Buffer.from(right.raw)))
    .map((member) => ({
      address: member.address,
      accountIdHex: member.accountIdHex,
    }));
}

export function deriveNativeMultisigAccount(
  members: string[],
  threshold: number,
  ss58Prefix = 0
) {
  if (members.length === 0) {
    throw new Error("At least one member is required.");
  }

  const sortedMembers = sortMultisigMembers(members, ss58Prefix);
  const rawMembers = sortedMembers.map((member) => hexToBytes(member.accountIdHex));
  const derived = blake2AsU8a(
    concatBytes(
      MULTISIG_PREFIX,
      compactToU8a(sortedMembers.length),
      ...rawMembers,
      thresholdToLeU16(threshold)
    ),
    256
  );

  return {
    accountIdHex: bytesToHex(derived) as Hex,
    address: encodeAddress(derived, ss58Prefix),
    members: sortedMembers.map((member) => member.address),
    memberAccountIds: sortedMembers.map((member) => member.accountIdHex),
    threshold,
  };
}

function decodeCompactPrefix(bytes: Uint8Array) {
  const flag = bytes[0] & 0b11;

  if (flag === 0b00) {
    return {
      offset: 1,
      value: bytes[0] >> 2,
    };
  }

  if (flag === 0b01) {
    return {
      offset: 2,
      value: (bytes[0] >> 2) | (bytes[1] << 6),
    };
  }

  if (flag === 0b10) {
    return {
      offset: 4,
      value:
        (bytes[0] >> 2) |
        (bytes[1] << 6) |
        (bytes[2] << 14) |
        (bytes[3] << 22),
    };
  }

  throw new Error("Unsupported compact prefix in extrinsic payload.");
}

export function extractUnsignedCallHex(extrinsicHex: Hex): Hex {
  const bytes = hexToBytes(extrinsicHex);
  const { offset } = decodeCompactPrefix(bytes);

  if (bytes.length <= offset + 1) {
    throw new Error("Extrinsic payload is too short to contain a call.");
  }

  return bytesToHex(bytes.slice(offset + 1)) as Hex;
}

export function hashCallHex(callHex: Hex): Hex {
  return bytesToHex(blake2AsU8a(hexToBytes(callHex), 256)) as Hex;
}

export function getCallHashFromExtrinsicHex(extrinsicHex: Hex): Hex {
  return hashCallHex(extractUnsignedCallHex(extrinsicHex));
}

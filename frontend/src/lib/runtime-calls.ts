import { encodeAddress } from "dedot/utils";
import type { Hex } from "viem";

import type { ChainTokenInfo, HubAsset, ReviveWeight } from "@/types/revive";

export interface RuntimeCallView {
  pallet: string;
  palletCall: {
    name: string;
    params?: Record<string, unknown>;
  };
}

function isHex32(value: unknown): value is Hex {
  return (
    typeof value === "string" &&
    value.startsWith("0x") &&
    value.length === 66
  );
}

function accountString(value: unknown, ss58Prefix = 0): string | null {
  if (!value) {
    return null;
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "object") {
    if ("Id" in value && typeof value.Id === "string") {
      return value.Id;
    }

    if ("raw" in value && isHex32(value.raw)) {
      return encodeAddress(value.raw, ss58Prefix);
    }

    const serialized = JSON.parse(JSON.stringify(value)) as
      | string
      | { Id?: string; value?: string };

    if (typeof serialized === "string") {
      return serialized;
    }

    if (serialized?.Id) {
      return serialized.Id;
    }

    if (serialized?.value) {
      return serialized.value;
    }
  }

  return null;
}

function numberValue(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "bigint") {
    return Number(value);
  }

  if (typeof value === "string" && value !== "") {
    return Number(value);
  }

  return null;
}

function bigintValue(value: unknown) {
  if (typeof value === "bigint") {
    return value;
  }

  if (typeof value === "number") {
    return BigInt(value);
  }

  if (typeof value === "string" && value !== "") {
    return BigInt(value);
  }

  return null;
}

export function summarizeRuntimeCall(params: {
  assets: HubAsset[];
  call?: RuntimeCallView | null;
  ss58Prefix?: number;
  token: ChainTokenInfo;
}) {
  const { assets, call, ss58Prefix = 0, token } = params;

  if (!call) {
    return "Pending call hash";
  }

  const pallet = call.pallet.toLowerCase();
  const callName = call.palletCall.name.toLowerCase();
  const args = call.palletCall.params ?? {};

  if (
    pallet === "balances" &&
    ["transferallowdeath", "transferkeepalive", "transferall"].includes(callName)
  ) {
    const destination =
      accountString(args.dest, ss58Prefix) ??
      accountString(args.target, ss58Prefix) ??
      "destination";
    const value = bigintValue(args.value ?? args.amount) ?? 0n;

    return `Send ${value.toString()} ${token.symbol} to ${destination}`;
  }

  if (
    pallet === "assets" &&
    ["transfer", "transferkeepalive"].includes(callName)
  ) {
    const assetId = numberValue(args.id) ?? numberValue(args.assetId) ?? 0;
    const destination =
      accountString(args.target, ss58Prefix) ??
      accountString(args.dest, ss58Prefix) ??
      "destination";
    const amount = bigintValue(args.amount ?? args.value) ?? 0n;
    const asset = assets.find((entry) => entry.id === assetId);

    return `Send ${amount.toString()} ${asset?.symbol || `Asset #${assetId}`} to ${destination}`;
  }

  return `${call.pallet}.${call.palletCall.name}`;
}

export function normalizeRuntimeCall(value: unknown): RuntimeCallView | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as {
    pallet?: string;
    palletCall?: {
      name?: string;
      params?: Record<string, unknown>;
    };
  };

  if (
    typeof record.pallet !== "string" ||
    typeof record.palletCall?.name !== "string"
  ) {
    return null;
  }

  return {
    pallet: record.pallet,
    palletCall: {
      name: record.palletCall.name,
      params: record.palletCall.params ?? {},
    },
  };
}

export function normalizeWeight(value: unknown): ReviveWeight | undefined {
  if (!value || typeof value !== "object") {
    return undefined;
  }

  const record = value as {
    proofSize?: bigint | number;
    refTime?: bigint | number;
  };

  if (record.refTime === undefined || record.proofSize === undefined) {
    return undefined;
  }

  return {
    proofSize: BigInt(record.proofSize),
    refTime: BigInt(record.refTime),
  };
}

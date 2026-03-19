import { useMutation } from "@tanstack/react-query";
import { useSendTransaction } from "@luno-kit/react";
import {
  encodeAbiParameters,
  encodeFunctionData,
  type Abi,
  type Address,
  type Hex,
} from "viem";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import type {
  DeployedContractResult,
  InstantiateRequest,
  ReviveWeight,
  ReviveWriteRequest,
} from "@/types/revive";

export const DEFAULT_CALL_WEIGHT: ReviveWeight = {
  refTime: 350_000_000_000n,
  proofSize: 200_000n,
};

export const DEFAULT_DEPLOY_WEIGHT: ReviveWeight = {
  refTime: 900_000_000_000n,
  proofSize: 450_000n,
};

function normalizeWeight(weight?: ReviveWeight) {
  return {
    refTime: weight?.refTime ?? DEFAULT_CALL_WEIGHT.refTime,
    proofSize: weight?.proofSize ?? DEFAULT_CALL_WEIGHT.proofSize,
  };
}

function toHexBytes(hex: Hex): number[] {
  const clean = hex.slice(2);
  const bytes: number[] = [];

  for (let index = 0; index < clean.length; index += 2) {
    bytes.push(Number.parseInt(clean.slice(index, index + 2), 16));
  }

  return bytes;
}

function encodeConstructorData(abi: Abi, args: unknown[] = []): Hex {
  const constructorAbi = abi.find((item) => item.type === "constructor");

  if (!constructorAbi || !constructorAbi.inputs || constructorAbi.inputs.length === 0) {
    return "0x";
  }

  return encodeAbiParameters(constructorAbi.inputs, args) as Hex;
}

function extractReceipt(result: unknown): DeployedContractResult {
  if (!result || typeof result !== "object") {
    return {};
  }

  const record = result as Record<string, unknown>;

  return {
    address:
      typeof record.contractAddress === "string"
        ? (record.contractAddress as Address)
        : undefined,
    blockHash:
      typeof record.blockHash === "string"
        ? (record.blockHash as Hex)
        : undefined,
    extrinsicHash:
      typeof record.extrinsicHash === "string"
        ? (record.extrinsicHash as Hex)
        : undefined,
  };
}

export function useReviveActions() {
  const { client } = usePolkadotClient();
  const { sendTransactionAsync, isPending } = useSendTransaction();

  const writeMutation = useMutation({
    mutationFn: async (request: ReviveWriteRequest) => {
      if (!client) {
        throw new Error("Dedot client is not ready yet");
      }

      const extrinsic = client.tx.revive.call(
        request.address,
        request.value ?? 0n,
        normalizeWeight(request.weightLimit),
        request.storageDepositLimit,
        toHexBytes(request.data)
      );

      return extractReceipt(await sendTransactionAsync({ extrinsic }));
    },
  });

  const instantiateMutation = useMutation({
    mutationFn: async (request: InstantiateRequest) => {
      if (!client) {
        throw new Error("Dedot client is not ready yet");
      }

      const extrinsic = client.tx.revive.instantiateWithCode(
        request.value ?? 0n,
        normalizeWeight(request.weightLimit ?? DEFAULT_DEPLOY_WEIGHT),
        request.storageDepositLimit,
        toHexBytes(request.bytecode),
        toHexBytes(encodeConstructorData(request.abi, request.constructorArgs)),
        request.salt ? toHexBytes(request.salt) : undefined
      );

      return extractReceipt(await sendTransactionAsync({ extrinsic }));
    },
  });

  return {
    callContract: writeMutation.mutateAsync,
    instantiateWithCode: instantiateMutation.mutateAsync,
    isSubmitting: isPending || writeMutation.isPending || instantiateMutation.isPending,
    error:
      (writeMutation.error instanceof Error && writeMutation.error.message) ||
      (instantiateMutation.error instanceof Error && instantiateMutation.error.message) ||
      undefined,
  };
}

export function encodeContractCall(request: {
  abi: Abi;
  functionName: string;
  args?: readonly unknown[];
}): Hex {
  return encodeFunctionData({
    abi: request.abi,
    functionName: request.functionName,
    args: request.args,
  });
}

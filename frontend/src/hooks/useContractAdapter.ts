import { useMemo } from "react";
import {
  createPublicClient,
  http,
  type Abi,
  type Address,
  type PublicClient,
} from "viem";

import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import type { ContractReadAdapter } from "@/types/revive";

function createAdapter(client: PublicClient): ContractReadAdapter {
  return {
    getBalance(address: Address) {
      return client.getBalance({ address });
    },
    async read<T>(request: {
      address: Address;
      abi: Abi;
      functionName: string;
      args?: readonly unknown[];
    }) {
      const result = await client.readContract({
        address: request.address,
        abi: request.abi,
        functionName: request.functionName as never,
        args: request.args as never,
      });

      return result as T;
    },
    async readMany<T>(
      requests: Array<{
        address: Address;
        abi: Abi;
        functionName: string;
        args?: readonly unknown[];
      }>
    ) {
      const results = await Promise.all(
        requests.map(async (request) => {
          try {
            return (await client.readContract({
              address: request.address,
              abi: request.abi,
              functionName: request.functionName as never,
              args: request.args as never,
            })) as T;
          } catch {
            return null;
          }
        })
      );

      return results;
    },
  };
}

export function useContractAdapter(): ContractReadAdapter {
  const { chain } = usePolkadotClient();

  return useMemo(() => {
    const publicClient = createPublicClient({
      transport: http(chain.ethRpcUrl),
    });

    return createAdapter(publicClient);
  }, [chain.ethRpcUrl]);
}

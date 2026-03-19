import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

import { erc20PrecompileAbi } from "@/config/contracts";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import { useHubAssets } from "@/hooks/useHubAssets";

export function useHubAssetBalances(owner?: Address) {
  const adapter = useContractAdapter();
  const { data: assets = [] } = useHubAssets();

  const result = useQuery({
    queryKey: [
      "hub-asset-balances",
      owner,
      assets.map((asset) => asset.id).join(","),
    ],
    enabled: !!owner && assets.length > 0,
    refetchInterval: 10_000,
    queryFn: () =>
      adapter.readMany<bigint>(
        assets.map((asset) => ({
          address: asset.precompileAddress,
          abi: erc20PrecompileAbi,
          functionName: "balanceOf",
          args: [owner as Address],
        }))
      ),
  });

  return {
    ...result,
    balances: assets.map((asset, index) => ({
      ...asset,
      balance: result.data?.[index] ?? 0n,
    })),
  };
}

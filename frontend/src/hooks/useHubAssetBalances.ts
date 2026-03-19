import { useReadContracts } from "wagmi";
import type { Address } from "viem";
import { erc20PrecompileAbi } from "@/config/contracts";
import { useHubAssets } from "@/hooks/useHubAssets";

export function useHubAssetBalances(owner?: Address) {
  const { data: assets = [] } = useHubAssets();

  const result = useReadContracts({
    contracts: assets.map((asset) => ({
      address: asset.precompileAddress,
      abi: erc20PrecompileAbi,
      functionName: "balanceOf" as const,
      args: owner ? [owner] : undefined,
    })),
    query: {
      enabled: !!owner && assets.length > 0,
      refetchInterval: 5_000,
    },
    allowFailure: true,
  });

  const balances = assets.map((asset, index) => {
    const balanceResult = result.data?.[index];
    return {
      ...asset,
      balance:
        balanceResult?.status === "success"
          ? (balanceResult.result as bigint)
          : 0n,
    };
  });

  return {
    ...result,
    balances,
  };
}

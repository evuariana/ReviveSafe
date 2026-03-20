import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAccount, useAccounts, useSendTransaction } from "@luno-kit/react";
import type { Hex } from "viem";

import {
  deriveMappingStatus,
  normalizeAccountId32,
} from "@/lib/account-mapping";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import type { MappingStatus } from "@/types/revive";

function delay(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export function useMappedAccount() {
  const { client } = usePolkadotClient();
  const queryClient = useQueryClient();
  const { account } = useAccount();
  const { sendTransactionAsync, isPending } = useSendTransaction({
    waitFor: "inBlock",
  });

  const derivedStatus = useMemo<MappingStatus | null>(() => {
    if (!account?.address) {
      return null;
    }

    return deriveMappingStatus(account.address);
  }, [account?.address]);

  const mappingQuery = useQuery({
    queryKey: ["mapping-status", derivedStatus?.ss58Address, derivedStatus?.mappedH160],
    enabled: !!client && !!derivedStatus,
    queryFn: async () => {
      if (!client || !derivedStatus) {
        return null;
      }

      if (derivedStatus.isEthDerived) {
        return {
          ...derivedStatus,
          isMapped: true,
        };
      }

      const originalAccount = await client.query.revive.originalAccount(
        derivedStatus.mappedH160
      );
      const normalized = normalizeAccountId32(originalAccount);

      return {
        ...derivedStatus,
        isMapped: normalized === derivedStatus.sourceAccountId32,
      };
    },
  });

  const mapAccountMutation = useMutation({
    mutationFn: async () => {
      if (!client) {
        throw new Error("Dedot client is not ready yet");
      }

      if (!account?.address) {
        throw new Error("Connect a wallet before mapping your account");
      }

      const extrinsic = client.tx.revive.mapAccount();
      const receipt = await sendTransactionAsync({ extrinsic });

      if (receipt.status === "failed") {
        throw new Error(
          receipt.errorMessage ?? "Account activation failed on-chain."
        );
      }

      return receipt;
    },
    onSuccess: async () => {
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const refreshed = await mappingQuery.refetch();
        if (refreshed.data?.isMapped) {
          return;
        }

        await delay(800);
      }

      await queryClient.invalidateQueries({
        queryKey: ["mapping-status"],
      });
    },
  });

  return {
    account,
    mappedAccount: mappingQuery.data ?? derivedStatus,
    isLoading: mappingQuery.isLoading,
    isRefreshing: mappingQuery.isRefetching,
    refetch: mappingQuery.refetch,
    isMapping: isPending || mapAccountMutation.isPending,
    mapAccount: mapAccountMutation.mutateAsync,
    mappingError:
      mapAccountMutation.error instanceof Error
        ? mapAccountMutation.error.message
        : undefined,
  };
}

export function useConnectedAccounts() {
  const { accounts } = useAccounts();

  return useMemo(
    () =>
      accounts.map((walletAccount) => {
        const mapping = deriveMappingStatus(walletAccount.address);

        return {
          address: walletAccount.address,
          name: walletAccount.name,
          mappedH160: mapping.mappedH160,
          sourceAccountId32: mapping.sourceAccountId32 as Hex,
        };
      }),
    [accounts]
  );
}

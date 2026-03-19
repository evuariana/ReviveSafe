import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Address } from "viem";

import { reviveFactoryAbi } from "@/config/contracts";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { encodeContractCall, useReviveActions } from "@/hooks/useReviveActions";

export function useReviveFactory() {
  const adapter = useContractAdapter();
  const queryClient = useQueryClient();
  const factoryAddress = useFactoryAddress((state) => state.factoryAddress);
  const { mappedAccount } = useMappedAccount();
  const { callContract, isSubmitting, error } = useReviveActions();

  const myMultisigsQuery = useQuery({
    queryKey: ["factory", "my-multisigs", factoryAddress, mappedAccount?.mappedH160],
    enabled: !!factoryAddress && !!mappedAccount?.mappedH160,
    refetchInterval: 10_000,
    queryFn: () =>
      adapter.read<readonly Address[]>({
        address: factoryAddress as Address,
        abi: reviveFactoryAbi,
        functionName: "getMyMultiSigs",
        args: [mappedAccount?.mappedH160 as Address],
      }),
  });

  const invalidateFactoryQueries = () =>
    queryClient.invalidateQueries({ queryKey: ["factory", "my-multisigs"] });

  const createMutation = useMutation({
    mutationFn: async ({
      owners,
      required,
    }: {
      owners: Address[];
      required: number;
    }) => {
      if (!factoryAddress) {
        throw new Error("Set or deploy a factory address before creating a multisig");
      }

      return callContract({
        address: factoryAddress,
        data: encodeContractCall({
          abi: reviveFactoryAbi,
          functionName: "createMultiSig",
          args: [owners, BigInt(required)],
        }),
      });
    },
    onSuccess: invalidateFactoryQueries,
  });

  const registerMutation = useMutation({
    mutationFn: async (multisigAddress: Address) => {
      if (!factoryAddress) {
        throw new Error("Set or deploy a factory address before registering a multisig");
      }

      return callContract({
        address: factoryAddress,
        data: encodeContractCall({
          abi: reviveFactoryAbi,
          functionName: "registerExistingMultisig",
          args: [multisigAddress],
        }),
      });
    },
    onSuccess: invalidateFactoryQueries,
  });

  return {
    factoryAddress,
    myMultisigs: Array.isArray(myMultisigsQuery.data)
      ? [...myMultisigsQuery.data]
      : [],
    myMultisigsQuery,
    createMultisig: createMutation.mutateAsync,
    isCreating: isSubmitting || createMutation.isPending,
    createSuccess: createMutation.isSuccess,
    registerMultisig: registerMutation.mutateAsync,
    isRegistering: isSubmitting || registerMutation.isPending,
    registerSuccess: registerMutation.isSuccess,
    isFactoryAvailable: !!factoryAddress,
    error:
      (createMutation.error instanceof Error && createMutation.error.message) ||
      (registerMutation.error instanceof Error && registerMutation.error.message) ||
      error,
  };
}

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Address } from "viem";
import { contracts } from "contracts";
import { FACTORY_ADDRESS } from "@/lib/wagmi";

export function useReviveFactory() {
  const factoryContract = contracts[FACTORY_ADDRESS];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const factoryAbi = factoryContract?.abi as any;

  // Get user's multisigs ONLY - secure approach
  const useMyMultisigs = (userAddress?: Address) => {
    return useReadContract({
      address: factoryContract?.address as Address,
      abi: factoryAbi,
      functionName: "getMyMultiSigs",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!factoryContract && !!factoryAbi && !!userAddress,
      },
    });
  };

  // Create new multisig
  const { writeContract: createMultisig, data: createTxHash } =
    useWriteContract();
  const { isLoading: isCreating, isSuccess: createSuccess } =
    useWaitForTransactionReceipt({
      hash: createTxHash,
    });

  const handleCreateMultisig = async (owners: Address[], required: number) => {
    if (!factoryContract || !factoryAbi) {
      throw new Error("Factory contract not available");
    }

    return createMultisig({
      address: factoryContract.address as Address,
      abi: factoryAbi,
      functionName: "createMultiSig",
      args: [owners, required],
    });
  };

  // Register existing multisig
  const { writeContract: registerMultisig, data: registerTxHash } =
    useWriteContract();
  const { isLoading: isRegistering, isSuccess: registerSuccess } =
    useWaitForTransactionReceipt({
      hash: registerTxHash,
    });

  const handleRegisterMultisig = async (multisigAddress: Address) => {
    if (!factoryContract || !factoryAbi) {
      throw new Error("Factory contract not available");
    }

    return registerMultisig({
      address: factoryContract.address as Address,
      abi: factoryAbi,
      functionName: "registerExistingMultisig",
      args: [multisigAddress],
    });
  };

  return {
    useMyMultisigs,
    createMultisig: handleCreateMultisig,
    isCreating,
    createSuccess,
    registerMultisig: handleRegisterMultisig,
    isRegistering,
    registerSuccess,
    isFactoryAvailable: !!factoryContract,
  };
}

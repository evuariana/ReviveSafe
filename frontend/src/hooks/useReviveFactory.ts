import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { Address } from "viem";
import { FACTORY_ADDRESS } from "@/config/constants";
import { reviveFactoryAbi } from "@/config/contracts";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000" as const;

export function useReviveFactory() {
  const factoryAddress = FACTORY_ADDRESS ?? ZERO_ADDRESS;

  // Get user's multisigs ONLY - secure approach
  const useMyMultisigs = (userAddress?: Address) => {
    return useReadContract({
      address: factoryAddress,
      abi: reviveFactoryAbi,
      functionName: "getMyMultiSigs",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!FACTORY_ADDRESS && !!userAddress,
        refetchInterval: 5_000,
      },
    });
  };

  // Create new multisig
  const { writeContractAsync: createMultisig, data: createTxHash } =
    useWriteContract();
  const { isLoading: isCreating, isSuccess: createSuccess } =
    useWaitForTransactionReceipt({
      hash: createTxHash,
    });

  const handleCreateMultisig = async (owners: Address[], required: number) => {
    if (!FACTORY_ADDRESS) {
      throw new Error("Set VITE_FACTORY_ADDRESS before creating a multisig");
    }

    return createMultisig({
      address: FACTORY_ADDRESS,
      abi: reviveFactoryAbi,
      functionName: "createMultiSig",
      args: [owners, BigInt(required)],
    });
  };

  // Register existing multisig
  const { writeContractAsync: registerMultisig, data: registerTxHash } =
    useWriteContract();
  const { isLoading: isRegistering, isSuccess: registerSuccess } =
    useWaitForTransactionReceipt({
      hash: registerTxHash,
    });

  const handleRegisterMultisig = async (multisigAddress: Address) => {
    if (!FACTORY_ADDRESS) {
      throw new Error("Set VITE_FACTORY_ADDRESS before registering a multisig");
    }

    return registerMultisig({
      address: FACTORY_ADDRESS,
      abi: reviveFactoryAbi,
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
    isFactoryAvailable: !!FACTORY_ADDRESS,
  };
}

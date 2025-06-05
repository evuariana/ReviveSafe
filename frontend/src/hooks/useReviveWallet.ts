// src/hooks/useReviveWallet.ts
import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance,
} from "wagmi";
import { Address } from "viem";
import { contracts } from "contracts";

export function useReviveWallet(address: Address) {
  // Get contract data - try direct lookup first
  let contractData = contracts[address.toLowerCase()];

  // If not found, find any MultisigWallet contract to use its ABI
  if (!contractData) {
    const multisigContract = Object.values(contracts).find(
      (contract) =>
        contract.name === "MultiSigWallet" || contract.name === "MultisigWallet"
    );

    if (multisigContract) {
      contractData = {
        name: "MultiSigWallet",
        address: address,
        abi: multisigContract.abi,
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const abi = contractData?.abi as any;

  // Basic multisig info
  const { data: owners } = useReadContract({
    address,
    abi,
    functionName: "getOwners",
    query: {
      enabled: !!abi,
    },
  });

  const { data: required } = useReadContract({
    address,
    abi,
    functionName: "required",
    query: {
      enabled: !!abi,
    },
  });

  const { data: transactionCount } = useReadContract({
    address,
    abi,
    functionName: "transactionCount",
    query: {
      enabled: !!abi,
    },
  });

  // Multisig wallet balance (not user balance)
  const { data: balance } = useBalance({ address });

  // Pending transactions count
  const { data: pendingCount } = useReadContract({
    address,
    abi,
    functionName: "getTransactionCount",
    args: [true, false], // pending = true, executed = false
    query: {
      enabled: !!abi,
    },
  });

  const pendingCountNumber = pendingCount ? Number(pendingCount) : 0;

  // Get pending transaction IDs
  const { data: pendingTxIds } = useReadContract({
    address,
    abi,
    functionName: "getTransactionIds",
    args: [0, pendingCountNumber, true, false],
    query: {
      enabled: !!abi && pendingCountNumber > 0,
    },
  });

  // Transaction operations
  const { writeContract: submitTransaction } = useWriteContract();
  const { writeContract: confirmTransaction } = useWriteContract();
  const { writeContract: executeTransaction } = useWriteContract();

  const handleSubmitTransaction = async (
    destination: Address,
    value: bigint,
    data: `0x${string}` = "0x"
  ) => {
    if (!abi) return;
    return submitTransaction({
      address,
      abi,
      functionName: "submitTransaction",
      args: [destination, value, data],
    });
  };

  const handleConfirmTransaction = async (txId: number) => {
    if (!abi) return;
    return confirmTransaction({
      address,
      abi,
      functionName: "confirmTransaction",
      args: [txId],
    });
  };

  const handleExecuteTransaction = async (txId: number) => {
    if (!abi) return;
    return executeTransaction({
      address,
      abi,
      functionName: "executeTransaction",
      args: [txId],
    });
  };

  // Helper hooks for transaction details
  const useTransaction = (txId: number) => {
    return useReadContract({
      address,
      abi,
      functionName: "transactions",
      args: [txId],
      query: {
        enabled: !!abi && txId >= 0,
      },
    });
  };

  const useTransactionConfirmations = (txId: number) => {
    return useReadContract({
      address,
      abi,
      functionName: "getConfirmations",
      args: [txId],
      query: {
        enabled: !!abi && txId >= 0,
      },
    });
  };

  const useIsTransactionConfirmed = (txId: number) => {
    return useReadContract({
      address,
      abi,
      functionName: "isConfirmed",
      args: [txId],
      query: {
        enabled: !!abi && txId >= 0,
      },
    });
  };

  const useIsOwner = (userAddress?: Address) => {
    return useReadContract({
      address,
      abi,
      functionName: "isOwner",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!abi && !!userAddress,
      },
    });
  };

  return {
    contractData,
    owners: owners as Address[] | undefined,
    required: required as number | undefined,
    balance,
    transactionCount: transactionCount as number | undefined,
    pendingCount: pendingCountNumber,
    pendingTxIds: pendingTxIds as number[] | undefined,
    submitTransaction: handleSubmitTransaction,
    confirmTransaction: handleConfirmTransaction,
    executeTransaction: handleExecuteTransaction,
    useTransaction,
    useTransactionConfirmations,
    useIsTransactionConfirmed,
    useIsOwner,
  };
}

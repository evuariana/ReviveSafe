// src/hooks/useReviveWallet.ts
import {
  useReadContract,
  useWriteContract,
  useBalance,
} from "wagmi";
import { type Address } from "viem";
import { reviveWalletAbi } from "@/config/contracts";

const REFRESH_INTERVAL = 5_000;

export function useReviveWallet(address: Address) {
  // Basic multisig info
  const { data: owners } = useReadContract({
    address,
    abi: reviveWalletAbi,
    functionName: "getOwners",
    query: {
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  const { data: required } = useReadContract({
    address,
    abi: reviveWalletAbi,
    functionName: "required",
    query: {
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  const { data: transactionCount } = useReadContract({
    address,
    abi: reviveWalletAbi,
    functionName: "transactionCount",
    query: {
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  // Multisig wallet balance (not user balance)
  const { data: balance } = useBalance({ address });

  // Pending transactions count
  const { data: pendingCount } = useReadContract({
    address,
    abi: reviveWalletAbi,
    functionName: "getTransactionCount",
    args: [true, false], // pending = true, executed = false
    query: {
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  const pendingCountNumber = pendingCount ? Number(pendingCount) : 0;

  // Get pending transaction IDs
  const { data: pendingTxIds } = useReadContract({
    address,
    abi: reviveWalletAbi,
    functionName: "getTransactionIds",
    args: [0n, BigInt(pendingCountNumber), true, false],
    query: {
      enabled: pendingCountNumber > 0,
      refetchInterval: REFRESH_INTERVAL,
    },
  });

  // Transaction operations
  const { writeContractAsync: submitTransaction } = useWriteContract();
  const { writeContractAsync: submitAssetTransfer } = useWriteContract();
  const { writeContractAsync: confirmTransaction } = useWriteContract();
  const { writeContractAsync: executeTransaction } = useWriteContract();

  const handleSubmitTransaction = async (
    destination: Address,
    value: bigint,
    data: `0x${string}` = "0x"
  ) => {
    return submitTransaction({
      address,
      abi: reviveWalletAbi,
      functionName: "submitTransaction",
      args: [destination, value, data],
    });
  };

  const handleSubmitAssetTransfer = async (
    assetId: number,
    destination: Address,
    amount: bigint
  ) => {
    return submitAssetTransfer({
      address,
      abi: reviveWalletAbi,
      functionName: "submitAssetTransfer",
      args: [assetId, destination, amount],
    });
  };

  const handleConfirmTransaction = async (txId: number) => {
    return confirmTransaction({
      address,
      abi: reviveWalletAbi,
      functionName: "confirmTransaction",
      args: [BigInt(txId)],
    });
  };

  const handleExecuteTransaction = async (txId: number) => {
    return executeTransaction({
      address,
      abi: reviveWalletAbi,
      functionName: "executeTransaction",
      args: [BigInt(txId)],
    });
  };

  // Helper hooks for transaction details
  const useTransaction = (txId: number) => {
    return useReadContract({
      address,
      abi: reviveWalletAbi,
      functionName: "transactions",
      args: [BigInt(txId)],
      query: {
        enabled: txId >= 0,
        refetchInterval: REFRESH_INTERVAL,
      },
    });
  };

  const useTransactionConfirmations = (txId: number) => {
    return useReadContract({
      address,
      abi: reviveWalletAbi,
      functionName: "getConfirmations",
      args: [BigInt(txId)],
      query: {
        enabled: txId >= 0,
        refetchInterval: REFRESH_INTERVAL,
      },
    });
  };

  const useIsTransactionConfirmed = (txId: number) => {
    return useReadContract({
      address,
      abi: reviveWalletAbi,
      functionName: "isConfirmed",
      args: [BigInt(txId)],
      query: {
        enabled: txId >= 0,
        refetchInterval: REFRESH_INTERVAL,
      },
    });
  };

  const useIsOwner = (userAddress?: Address) => {
    return useReadContract({
      address,
      abi: reviveWalletAbi,
      functionName: "isOwner",
      args: userAddress ? [userAddress] : undefined,
      query: {
        enabled: !!userAddress,
        refetchInterval: REFRESH_INTERVAL,
      },
    });
  };

  return {
    owners: owners as Address[] | undefined,
    required: required ? Number(required) : undefined,
    balance,
    transactionCount: transactionCount ? Number(transactionCount) : undefined,
    pendingCount: pendingCountNumber,
    pendingTxIds: (pendingTxIds as bigint[] | undefined)?.map((id) =>
      Number(id)
    ),
    submitTransaction: handleSubmitTransaction,
    submitAssetTransfer: handleSubmitAssetTransfer,
    confirmTransaction: handleConfirmTransaction,
    executeTransaction: handleExecuteTransaction,
    useTransaction,
    useTransactionConfirmations,
    useIsTransactionConfirmed,
    useIsOwner,
  };
}

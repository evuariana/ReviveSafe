import { Address } from "viem";

export interface MultisigData {
  address: Address;
  owners: Address[];
  required: number;
  balance: bigint;
  transactionCount: number;
  pendingTransactions: number;
}

export interface Transaction {
  id: number;
  destination: Address;
  value: bigint;
  data: `0x${string}`;
  executed: boolean;
  confirmations: Address[];
  isConfirmed: boolean;
  canExecute: boolean;
}

export interface PendingTransaction extends Transaction {
  executed: false;
}

export interface MultisigOwner {
  address: Address;
  hasConfirmed: boolean;
}

export interface MultisigFactory {
  address: Address;
  allMultisigs: Address[];
}

export interface CreateMultisigParams {
  owners: Address[];
  required: number;
}

export interface MultisigStats {
  totalMultisigs: number;
  totalBalance: bigint;
  pendingTransactions: number;
  uniqueOwners: number;
}

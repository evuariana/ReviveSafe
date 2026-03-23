import type { Abi, Address, Hex } from "viem";

export type SupportedHubChain = "paseoAssetHub" | "polkadotAssetHub";

export interface HubChainConfig {
  key: SupportedHubChain;
  name: string;
  symbol: string;
  testnet: boolean;
  ethRpcUrl: string;
  wsUrl: string;
  explorerUrl: string;
  chainNameMatch: string;
}

export interface MappingStatus {
  ss58Address: string;
  mappedH160: Address;
  fallbackAccountId32: Hex;
  isEthDerived: boolean;
  isMapped: boolean;
  sourceAccountId32: Hex;
}

export interface ChainTokenInfo {
  symbol: string;
  decimals: number;
  existentialDeposit: bigint;
  loading: boolean;
}

export interface HubAsset {
  id: number;
  name: string;
  symbol: string;
  decimals: number;
  precompileAddress: Address;
}

export interface HubAssetBalance extends HubAsset {
  balance: bigint;
}

export interface ReviveWeight {
  refTime: bigint;
  proofSize: bigint;
}

export interface ReviveWriteRequest {
  address: Address;
  data: Hex;
  value?: bigint;
  weightLimit?: ReviveWeight;
  storageDepositLimit?: bigint;
}

export interface InstantiateRequest {
  abi: Abi;
  bytecode: Hex;
  constructorArgs?: unknown[];
  value?: bigint;
  weightLimit?: ReviveWeight;
  storageDepositLimit?: bigint;
  salt?: Hex;
}

export interface ContractReadAdapter {
  getBalance(address: Address): Promise<bigint>;
  read<T>(request: {
    address: Address;
    abi: Abi;
    functionName: string;
    args?: readonly unknown[];
  }): Promise<T>;
  readMany<T>(
    requests: Array<{
      address: Address;
      abi: Abi;
      functionName: string;
      args?: readonly unknown[];
    }>
  ): Promise<Array<T | null>>;
}

export interface FactoryArtifact {
  abi: Abi;
  bytecode: Hex;
}

export interface DeployedContractResult {
  address?: Address;
  blockHash?: Hex;
  extrinsicHash?: Hex;
}

export interface ImportedNativeWalletRecord {
  address: string;
  accountIdHex: Hex;
  chainKey: SupportedHubChain;
  importedAt: number;
  members: string[];
  memberAccountIds: Hex[];
  name?: string;
  ss58Prefix: number;
  threshold: number;
}

export type NativeWorkspaceEventKind =
  | "wallet_imported"
  | "proposal_submitted"
  | "proposal_approved"
  | "proposal_executed";

export interface NativeWorkspaceEvent {
  id: string;
  chainKey: SupportedHubChain;
  createdAt: number;
  description: string;
  extrinsicHash?: Hex;
  kind: NativeWorkspaceEventKind;
  title: string;
  walletAccountIdHex: Hex;
  walletAddress: string;
}

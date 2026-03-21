import { parseAbi } from "viem";

export const reviveFactoryAbi = parseAbi([
  "function createMultiSig(address[] owners, uint256 required) returns (address multisig)",
  "function registerExistingMultisig(address multisig)",
  "function getMyMultiSigs(address owner) view returns (address[] myMultisigs)",
  "function getAllMultiSigs() view returns (address[] multisigs)",
]);

export const reviveWalletAbi = parseAbi([
  "function getOwners() view returns (address[])",
  "function required() view returns (uint256)",
  "function transactionCount() view returns (uint256)",
  "function executionPolicy() view returns (uint8)",
  "function walletCoreVersion() view returns (uint32)",
  "function getTransactionCount(bool pending, bool executed) view returns (uint256 count)",
  "function getTransactionIds(uint256 from, uint256 to, bool pending, bool executed) view returns (uint256[] transactionIds)",
  "function getTransaction(uint256 transactionId) view returns (address destination, uint256 value, bytes data, bool executed)",
  "function transactions(uint256 transactionId) view returns (address destination, uint256 value, bytes data, bool executed)",
  "function getConfirmations(uint256 transactionId) view returns (address[] confirmations)",
  "function isConfirmed(uint256 transactionId) view returns (bool)",
  "function isOwner(address owner) view returns (bool)",
  "function canConfirmTransaction(uint256 transactionId, address owner) view returns (bool)",
  "function canExecuteTransaction(uint256 transactionId, address owner) view returns (bool)",
  "function submitTransaction(address destination, uint256 value, bytes data) returns (uint256 transactionId)",
  "function submitAssetTransfer(uint32 assetId, address destination, uint256 amount) returns (uint256 transactionId)",
  "function getAssetPrecompileAddress(uint32 assetId) pure returns (address assetPrecompile)",
  "function changeExecutionPolicy(uint8 executionPolicy)",
  "function confirmTransaction(uint256 transactionId)",
  "function executeTransaction(uint256 transactionId)",
]);

export const erc20PrecompileAbi = parseAbi([
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
]);

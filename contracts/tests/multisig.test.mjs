import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { ethers } from "ethers";
import ganache from "ganache";
import solc from "solc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const walletSource = readFileSync(
  path.join(__dirname, "..", "ReviveMultisig.sol"),
  "utf8"
);

const ERC20_PRECOMPILE_SUFFIX = 0x01200000n;
const ASSET_ID_SHIFT = 128n;
const transferInterface = new ethers.Interface([
  "function transfer(address recipient, uint256 amount)",
]);

function compileWallet() {
  const input = {
    language: "Solidity",
    sources: {
      "ReviveMultisig.sol": {
        content: walletSource,
      },
    },
    settings: {
      evmVersion: "paris",
      optimizer: { enabled: true, runs: 200 },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  };

  const output = JSON.parse(solc.compile(JSON.stringify(input)));
  const errors = output.errors?.filter((entry) => entry.severity === "error") ?? [];

  if (errors.length > 0) {
    throw new Error(errors.map((entry) => entry.formattedMessage).join("\n\n"));
  }

  const contract = output.contracts["ReviveMultisig.sol"].MultiSigWallet;

  return {
    abi: contract.abi,
    bytecode: `0x${contract.evm.bytecode.object}`,
  };
}

const compiledWallet = compileWallet();

function assetIdToPrecompileAddress(assetId) {
  const value = (BigInt(assetId) << ASSET_ID_SHIFT) | ERC20_PRECOMPILE_SUFFIX;
  return ethers.getAddress(`0x${value.toString(16).padStart(40, "0")}`);
}

function expectCallException(error) {
  assert.match(String(error), /CALL_EXCEPTION|missing revert data/);
  return true;
}

async function deployWallet() {
  const rpcProvider = ganache.provider({
    chain: { chainId: 1337 },
    logging: { quiet: true },
    wallet: { totalAccounts: 6 },
  });
  const provider = new ethers.BrowserProvider(rpcProvider);
  const signers = await Promise.all([
    provider.getSigner(0),
    provider.getSigner(1),
    provider.getSigner(2),
    provider.getSigner(3),
  ]);
  const owners = await Promise.all(signers.slice(0, 3).map((signer) => signer.getAddress()));

  const factory = new ethers.ContractFactory(
    compiledWallet.abi,
    compiledWallet.bytecode,
    signers[0]
  );
  const contract = await factory.deploy(owners, 2);
  await contract.waitForDeployment();

  return {
    contract,
    rpcProvider,
    signers,
    owners,
    walletAddress: await contract.getAddress(),
  };
}

test("keeps proposals pending until an explicit execution and lets any owner execute by default", async (t) => {
  const { contract, rpcProvider, signers, owners, walletAddress } = await deployWallet();
  t.after(() => rpcProvider.disconnect());
  const callData = contract.interface.encodeFunctionData("walletCoreVersion");

  await (await contract.connect(signers[0]).submitTransaction(walletAddress, 0n, callData)).wait();

  let storedTransaction = await contract.getTransaction(0n);
  assert.equal(storedTransaction[3], false);
  assert.equal(await contract.getConfirmationCount(0n), 1n);

  await (await contract.connect(signers[1]).confirmTransaction(0n)).wait();

  assert.equal(await contract.isConfirmed(0n), true);
  assert.equal(await contract.canConfirmTransaction(0n, owners[2]), false);
  assert.equal(await contract.canExecuteTransaction(0n, owners[2]), true);

  storedTransaction = await contract.getTransaction(0n);
  assert.equal(storedTransaction[3], false);

  await (await contract.connect(signers[2]).executeTransaction(0n)).wait();

  storedTransaction = await contract.getTransaction(0n);
  assert.equal(storedTransaction[3], true);
});

test("can move to confirming-owner execution through wallet governance", async (t) => {
  const { contract, rpcProvider, signers, owners, walletAddress } = await deployWallet();
  t.after(() => rpcProvider.disconnect());
  const policyChangeData = contract.interface.encodeFunctionData(
    "changeExecutionPolicy",
    [1]
  );

  await (await contract.connect(signers[0]).submitTransaction(walletAddress, 0n, policyChangeData)).wait();
  await (await contract.connect(signers[1]).confirmTransaction(0n)).wait();
  await (await contract.connect(signers[2]).executeTransaction(0n)).wait();

  assert.equal(Number(await contract.executionPolicy()), 1);

  const callData = contract.interface.encodeFunctionData("walletCoreVersion");
  await (await contract.connect(signers[0]).submitTransaction(walletAddress, 0n, callData)).wait();
  await (await contract.connect(signers[1]).confirmTransaction(1n)).wait();

  assert.equal(await contract.canExecuteTransaction(1n, owners[2]), false);
  assert.equal(await contract.canExecuteTransaction(1n, owners[1]), true);

  await assert.rejects(
    async () => {
      const tx = await contract.connect(signers[2]).executeTransaction(1n);
      await tx.wait();
    },
    expectCallException
  );

  await (await contract.connect(signers[1]).executeTransaction(1n)).wait();

  const storedTransaction = await contract.getTransaction(1n);
  assert.equal(storedTransaction[3], true);
});

test("encodes deterministic asset-precompile transfers and rejects invalid submissions", async (t) => {
  const { contract, rpcProvider, signers, owners } = await deployWallet();
  t.after(() => rpcProvider.disconnect());

  await assert.rejects(
    async () => {
      const tx = await contract.connect(signers[0]).submitTransaction(owners[2], 0n, "0x");
      await tx.wait();
    },
    expectCallException
  );

  await assert.rejects(
    async () => {
      const tx = await contract
        .connect(signers[0])
        .submitAssetTransfer(1984, ethers.ZeroAddress, 1n);
      await tx.wait();
    },
    expectCallException
  );

  await assert.rejects(
    async () => {
      const tx = await contract.connect(signers[0]).submitAssetTransfer(1984, owners[2], 0n);
      await tx.wait();
    },
    expectCallException
  );

  await (await contract.connect(signers[0]).submitAssetTransfer(1984, owners[2], 500n)).wait();

  const precompileAddress = await contract.getAssetPrecompileAddress(1984);
  assert.equal(precompileAddress, assetIdToPrecompileAddress(1984));

  const storedTransaction = await contract.getTransaction(0n);
  assert.equal(storedTransaction[0], precompileAddress);

  const decodedTransfer = transferInterface.decodeFunctionData(
    "transfer",
    storedTransaction[2]
  );
  assert.equal(decodedTransfer[0], owners[2]);
  assert.equal(decodedTransfer[1], 500n);

  const transactionIds = await contract.getTransactionIds(0n, 5n, true, false);
  assert.deepEqual(transactionIds.map(Number), [0]);
});

test("refuses zero-address owner replacements through wallet governance", async (t) => {
  const { contract, rpcProvider, signers, owners, walletAddress } = await deployWallet();
  t.after(() => rpcProvider.disconnect());
  const replaceOwnerData = contract.interface.encodeFunctionData("replaceOwner", [
    owners[1],
    ethers.ZeroAddress,
  ]);

  await (await contract.connect(signers[0]).submitTransaction(walletAddress, 0n, replaceOwnerData)).wait();
  await (await contract.connect(signers[1]).confirmTransaction(0n)).wait();
  await (await contract.connect(signers[2]).executeTransaction(0n)).wait();

  const storedTransaction = await contract.getTransaction(0n);
  assert.equal(storedTransaction[3], false);
  assert.equal(await contract.isOwner(owners[1]), true);
  assert.equal(await contract.isOwner(ethers.ZeroAddress), false);
});

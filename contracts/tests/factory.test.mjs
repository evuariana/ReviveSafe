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
const factorySource = readFileSync(
  path.join(__dirname, "..", "ReviveFactory.sol"),
  "utf8"
);
const helperContractsSource = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./ReviveFactory.sol";

contract SpoofWallet {
    function walletCoreVersion() external pure returns (uint32) {
        return 2;
    }
}

contract UnsafeFactory is MultiSigFactory {
    function forceRegister(address multisig) external {
        allMultiSigs.push(multisig);
        isRegistered[multisig] = true;
    }
}
`;

function compileContracts() {
  const input = {
    language: "Solidity",
    sources: {
      "ReviveMultisig.sol": { content: walletSource },
      "./ReviveMultisig.sol": { content: walletSource },
      "ReviveFactory.sol": { content: factorySource },
      "./ReviveFactory.sol": { content: factorySource },
      "FactoryTestHelpers.sol": { content: helperContractsSource },
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

  return {
    factory: output.contracts["./ReviveFactory.sol"].MultiSigFactory,
    spoofWallet: output.contracts["FactoryTestHelpers.sol"].SpoofWallet,
    unsafeFactory: output.contracts["FactoryTestHelpers.sol"].UnsafeFactory,
    wallet: output.contracts["./ReviveMultisig.sol"].MultiSigWallet,
  };
}

const compiledContracts = compileContracts();

function expectCallException(error) {
  assert.match(String(error), /CALL_EXCEPTION|missing revert data/);
  return true;
}

async function deployContract(contract, signer, args = []) {
  const factory = new ethers.ContractFactory(
    contract.abi,
    `0x${contract.evm.bytecode.object}`,
    signer
  );
  const instance = await factory.deploy(...args);
  await instance.waitForDeployment();
  return instance;
}

async function setupProvider() {
  const rpcProvider = ganache.provider({
    chain: { chainId: 1338 },
    logging: { quiet: true },
    wallet: { totalAccounts: 5 },
  });
  const provider = new ethers.BrowserProvider(rpcProvider);
  const signers = await Promise.all([
    provider.getSigner(0),
    provider.getSigner(1),
    provider.getSigner(2),
  ]);

  return { rpcProvider, provider, signers };
}

test("rejects spoof contracts during existing-wallet registration", async (t) => {
  const { rpcProvider, signers } = await setupProvider();
  t.after(() => rpcProvider.disconnect());

  const factory = await deployContract(compiledContracts.factory, signers[0]);
  const spoofWallet = await deployContract(compiledContracts.spoofWallet, signers[0]);

  await assert.rejects(
    async () => {
      const tx = await factory.registerExistingMultisig(
        await spoofWallet.getAddress()
      );
      await tx.wait();
    },
    expectCallException
  );

  const allWallets = await factory.getAllMultiSigs();
  assert.deepEqual(Array.from(allWallets), []);
});

test("ignores incompatible registry entries when filtering my wallets", async (t) => {
  const { rpcProvider, signers } = await setupProvider();
  t.after(() => rpcProvider.disconnect());

  const unsafeFactory = await deployContract(compiledContracts.unsafeFactory, signers[0]);
  const spoofWallet = await deployContract(compiledContracts.spoofWallet, signers[0]);
  const owners = await Promise.all(signers.map((signer) => signer.getAddress()));
  const validWallet = await deployContract(compiledContracts.wallet, signers[0], [
    owners,
    2,
  ]);

  await (await unsafeFactory.forceRegister(await spoofWallet.getAddress())).wait();
  await (await unsafeFactory.registerExistingMultisig(await validWallet.getAddress())).wait();

  const myWallets = await unsafeFactory.getMyMultiSigs(owners[0]);
  assert.deepEqual(Array.from(myWallets), [await validWallet.getAddress()]);
});

import { ethers } from "ethers";
import path from "path";
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "fs";
// based on https://github.com/paritytech/contracts-boilerplate/tree/e86ffe91f7117faf21378395686665856c605132/ethers/tools
if (!process.env.RPC_URL) {
    console.error("RPC_URL environment variable is required for deploying smart contract");
    process.exit(1);
}
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const deployerKey = process.env.PRIVATE_KEY ?? process.env.ACCOUNT_SEED;
if (!deployerKey) {
    console.error("PRIVATE_KEY or ACCOUNT_SEED environment variable is required for deploying smart contract");
    process.exit(1);
}
const wallet = deployerKey.trim().startsWith("0x")
    ? new ethers.Wallet(deployerKey, provider)
    : ethers.Wallet.fromPhrase(deployerKey, provider);
const buildDir = ".build";
const contractsOutDir = path.join(buildDir, "contracts");
const deploysDir = path.join(".deploys", "deployed-contracts");
mkdirSync(deploysDir, { recursive: true });
const deployTarget = process.env.CONTRACT_NAME ?? "MultiSigFactory";
const constructorArgs = process.env.CONSTRUCTOR_ARGS
    ? JSON.parse(process.env.CONSTRUCTOR_ARGS)
    : [];
if (!Array.isArray(constructorArgs)) {
    console.error("CONSTRUCTOR_ARGS must be a JSON array");
    process.exit(1);
}
(async () => {
    const file = `${deployTarget}.json`;
    const artifactPath = path.join(contractsOutDir, file);
    if (!readdirSync(contractsOutDir).includes(file)) {
        console.error(`Unable to find compiled contract artifact for ${deployTarget}`);
        process.exit(1);
    }
    const contract = JSON.parse(readFileSync(artifactPath, "utf8"));
    const factory = new ethers.ContractFactory(contract.abi, contract.bytecode, wallet);
    console.log(`Deploying contract ${deployTarget}...`);
    const deployedContract = await factory.deploy(...constructorArgs);
    await deployedContract.waitForDeployment();
    const address = await deployedContract.getAddress();
    console.log(`Deployed contract ${deployTarget}: ${address}`);
    const fileContent = JSON.stringify({
        name: deployTarget,
        address,
        abi: contract.abi,
        deployedAt: Date.now()
    });
    writeFileSync(path.join(deploysDir, `${address}.json`), fileContent);
})().catch(err => {
    console.error(err);
    process.exit(1);
});

import { createRequire } from "module";
import { readFileSync, writeFileSync, readdirSync, rmSync, mkdirSync } from "fs";
import path from "path";
// based on https://github.com/paritytech/contracts-boilerplate/tree/e86ffe91f7117faf21378395686665856c605132/ethers/tools
const buildDir = ".build";
const contractsOutDir = path.join(buildDir, "contracts");
rmSync(contractsOutDir, { recursive: true, force: true });
mkdirSync(contractsOutDir, { recursive: true });
const require = createRequire(import.meta.url);
const resolcEntrypoint = require.resolve("@parity/resolc");
const { resolc } = require(path.join(path.dirname(resolcEntrypoint), "resolc.js"));
const contracts = readdirSync(process.cwd()).filter((f) => f.endsWith(".sol"));
console.log("Compiling contracts...");
(async () => {
    const input = JSON.stringify({
        language: "Solidity",
        sources: Object.fromEntries(contracts.map((file) => [
            `./${file}`,
            { content: readFileSync(file, "utf8") },
        ])),
        settings: {
            optimizer: { mode: "z", enabled: true, runs: 200 },
            outputSelection: { "*": { "*": ["abi", "evm.bytecode"] } },
        },
    });
    const out = resolc(input);
    for (const compiledContracts of Object.values(out.contracts)) {
        for (const [name, contract] of Object.entries(compiledContracts)) {
            console.log(`Writing contract ${name}...`);
            writeFileSync(path.join(contractsOutDir, `${name}.json`), JSON.stringify({ abi: contract.abi, bytecode: `0x${contract.evm.bytecode.object}` }, null, 2));
        }
    }
})().catch(err => {
    console.error(err);
    process.exit(1);
});

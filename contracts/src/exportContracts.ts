// exportContracts.ts
import fs from "fs";
import path from "path";
// Add these two lines to create an ES-module “__dirname” substitute:
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let res = "export const contracts = {";

// … rest of your code unchanged, e.g. …

// 1) List of directories to search (now that __dirname is defined)
const searchDirs = [
  // if this file lives in `contracts/src/`, then __dirname → dist/ after compilation
  path.join(__dirname, "..", ".deploys", "pinned-contracts"),
  path.join(__dirname, "..", ".deploys", "deployed-contracts"),
];

function collectContractFiles(dirPath: string): string[] {
  const result: string[] = [];
  if (!fs.existsSync(dirPath)) {
    return result;
  }
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullp = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...collectContractFiles(fullp));
    } else if (
      entry.isFile() &&
      entry.name.startsWith("0x") &&
      entry.name.endsWith(".json")
    ) {
      result.push(fullp);
    }
  }
  return result;
}

let filePaths: string[] = [];
for (const dir of searchDirs) {
  filePaths.push(...collectContractFiles(dir));
}

if (filePaths.length === 0) {
  console.warn(
    "No contracts found; remember to pin deployed contracts in Remix or build them locally, in order to use them from frontend"
  );
  process.exit(1);
}

for (const fullPath of filePaths) {
  const filename = path.basename(fullPath); // e.g. "0x1234abcd... .json"
  const strippedAddress = filename.slice(2, filename.length - 5);
  console.log(`Processing contract ${strippedAddress}`);

  const value = fs.readFileSync(fullPath, "utf-8");
  res += `\n  "${strippedAddress}": ${value},\n`;
}

res += "};";

const outPath = path.join(__dirname, "contracts.js");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, res, "utf-8");

console.log(`Exported contracts to ${outPath}`);

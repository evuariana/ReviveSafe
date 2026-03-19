import { useMemo, useState } from "react";
import { Abi, AbiFunction, type Address, type Hex, isAddress } from "viem";

import bundledFactorySource from "../../../contracts/ReviveFactory.sol?raw";
import bundledWalletSource from "../../../contracts/ReviveMultisig.sol?raw";

import { AmountInput } from "@/components/inputs/amount-input";
import { BalanceInput } from "@/components/inputs/balance-input";
import { BytesInput } from "@/components/inputs/bytes-input";
import { OptionInput } from "@/components/inputs/option-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useChainToken } from "@/hooks/useChainToken";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import {
  DEFAULT_DEPLOY_WEIGHT,
  encodeContractCall,
  useReviveActions,
} from "@/hooks/useReviveActions";

type DeployMode = "bundled" | "source" | "artifact";

interface CompiledArtifact {
  abi: Abi;
  abiText: string;
  bytecode: Hex;
  contractName: string;
}

function isAbiFunction(item: Abi[number]): item is AbiFunction {
  return item.type === "function";
}

async function compileSources(
  sources: Record<string, string>,
  contractName: string
): Promise<CompiledArtifact> {
  const { resolc } = await import("@parity/resolc-browser");

  const input = JSON.stringify({
    language: "Solidity",
    sources: Object.fromEntries(
      Object.entries(sources).map(([fileName, content]) => [
        fileName,
        { content },
      ])
    ),
    settings: {
      optimizer: {
        mode: "z",
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["abi", "evm.bytecode"],
        },
      },
    },
  });

  const output = resolc(input) as {
    errors?: Array<{ severity: string; formattedMessage: string }>;
    contracts?: Record<
      string,
      Record<string, { abi: Abi; evm: { bytecode: { object: string } } }>
    >;
  };

  const compileErrors = (output.errors ?? [])
    .filter((error) => error.severity === "error")
    .map((error) => error.formattedMessage);

  if (compileErrors.length > 0) {
    throw new Error(compileErrors.join("\n\n"));
  }

  const compiledContract = Object.values(output.contracts ?? {})
    .flatMap((contractGroup) => Object.entries(contractGroup))
    .find(([name]) => name === contractName)?.[1];

  if (!compiledContract) {
    throw new Error(`Unable to find compiled contract "${contractName}" in output.`);
  }

  return {
    abi: compiledContract.abi,
    abiText: JSON.stringify(compiledContract.abi, null, 2),
    bytecode: `0x${compiledContract.evm.bytecode.object}` as Hex,
    contractName,
  };
}

export default function Deploy() {
  const token = useChainToken();
  const { instantiateWithCode, callContract, isSubmitting, error } =
    useReviveActions();
  const factoryAddress = useFactoryAddress((state) => state.factoryAddress);
  const setFactoryAddress = useFactoryAddress((state) => state.setFactoryAddress);

  const [mode, setMode] = useState<DeployMode>("bundled");
  const [bundledContractName, setBundledContractName] =
    useState("MultiSigFactory");
  const [sourceFileName, setSourceFileName] = useState("Contract.sol");
  const [sourceContractName, setSourceContractName] = useState("Contract");
  const [sourceCode, setSourceCode] = useState(
    'pragma solidity ^0.8.28;\n\ncontract Counter {\n    uint256 public number;\n\n    constructor(uint256 initialValue) {\n        number = initialValue;\n    }\n\n    function set(uint256 nextValue) external {\n        number = nextValue;\n    }\n}\n'
  );
  const [artifactAbiText, setArtifactAbiText] = useState("[]");
  const [artifactBytecode, setArtifactBytecode] = useState<Hex | undefined>();
  const [compiledArtifact, setCompiledArtifact] = useState<CompiledArtifact | null>(
    null
  );
  const [compileOutput, setCompileOutput] = useState<string>();
  const [constructorArgsText, setConstructorArgsText] = useState("[]");
  const [deployValue, setDeployValue] = useState<string>("0");
  const [weightRefTime, setWeightRefTime] = useState(
    DEFAULT_DEPLOY_WEIGHT.refTime.toString()
  );
  const [weightProofSize, setWeightProofSize] = useState(
    DEFAULT_DEPLOY_WEIGHT.proofSize.toString()
  );
  const [storageDepositEnabled, setStorageDepositEnabled] = useState(false);
  const [storageDeposit, setStorageDeposit] = useState<string>();
  const [saltEnabled, setSaltEnabled] = useState(false);
  const [salt, setSalt] = useState<Hex | undefined>();
  const [deployStatus, setDeployStatus] = useState<string>();
  const [callAddress, setCallAddress] = useState<string>(factoryAddress ?? "");
  const [callAbiText, setCallAbiText] = useState("[]");
  const [callFunction, setCallFunction] = useState("");
  const [callArgsText, setCallArgsText] = useState("[]");
  const [callValue, setCallValue] = useState<string>("0");
  const [callStatus, setCallStatus] = useState<string>();

  const resolvedArtifact = useMemo(() => {
    if (mode === "artifact") {
      try {
        return {
          abi: JSON.parse(artifactAbiText) as Abi,
          abiText: artifactAbiText,
          bytecode: artifactBytecode ?? "0x",
          contractName: "UploadedArtifact",
        } satisfies CompiledArtifact;
      } catch {
        return null;
      }
    }

    return compiledArtifact;
  }, [artifactAbiText, artifactBytecode, compiledArtifact, mode]);

  const writableFunctions = useMemo(() => {
    try {
      const parsedAbi = JSON.parse(callAbiText) as Abi;
      return parsedAbi.filter(
        (item): item is AbiFunction =>
          isAbiFunction(item) &&
          item.stateMutability !== "view" &&
          item.stateMutability !== "pure"
      );
    } catch {
      return [];
    }
  }, [callAbiText]);

  const compileBundledContract = async () => {
    try {
      setCompileOutput("Compiling bundled ReviveSafe contracts...");
      const artifact = await compileSources(
        {
          "ReviveFactory.sol": bundledFactorySource,
          "ReviveMultisig.sol": bundledWalletSource,
        },
        bundledContractName
      );
      setCompiledArtifact(artifact);
      setArtifactAbiText(artifact.abiText);
      setArtifactBytecode(artifact.bytecode);
      setCallAbiText(artifact.abiText);
      setCompileOutput(`Compiled ${artifact.contractName} successfully.`);
    } catch (compileError) {
      setCompileOutput(
        compileError instanceof Error
          ? compileError.message
          : "Compilation failed"
      );
    }
  };

  const compileCustomSource = async () => {
    try {
      setCompileOutput("Compiling pasted source...");
      const artifact = await compileSources(
        {
          [sourceFileName]: sourceCode,
        },
        sourceContractName
      );
      setCompiledArtifact(artifact);
      setArtifactAbiText(artifact.abiText);
      setArtifactBytecode(artifact.bytecode);
      setCallAbiText(artifact.abiText);
      setCompileOutput(`Compiled ${artifact.contractName} successfully.`);
    } catch (compileError) {
      setCompileOutput(
        compileError instanceof Error
          ? compileError.message
          : "Compilation failed"
      );
    }
  };

  const deploy = async () => {
    if (!resolvedArtifact) {
      setDeployStatus("Compile or upload a contract artifact first.");
      return;
    }

    try {
      const constructorArgs = JSON.parse(constructorArgsText) as unknown[];
      const result = await instantiateWithCode({
        abi: resolvedArtifact.abi,
        bytecode: resolvedArtifact.bytecode,
        constructorArgs,
        value: BigInt(deployValue ?? "0"),
        weightLimit: {
          refTime: BigInt(weightRefTime || DEFAULT_DEPLOY_WEIGHT.refTime),
          proofSize: BigInt(weightProofSize || DEFAULT_DEPLOY_WEIGHT.proofSize),
        },
        storageDepositLimit: storageDepositEnabled
          ? BigInt(storageDeposit ?? "0")
          : undefined,
        salt: saltEnabled ? salt : undefined,
      });

      if (result.address) {
        setCallAddress(result.address);
      }

      setDeployStatus(
        result.address
          ? `Deployment submitted. Contract address: ${result.address}`
          : `Deployment submitted. Block hash: ${result.blockHash ?? "pending"}`
      );
    } catch (deployError) {
      setDeployStatus(
        deployError instanceof Error ? deployError.message : "Deployment failed"
      );
    }
  };

  const submitWriteCall = async () => {
    if (!isAddress(callAddress)) {
      setCallStatus("Enter a valid deployed contract address.");
      return;
    }

    try {
      const abi = JSON.parse(callAbiText) as Abi;
      const args = JSON.parse(callArgsText) as unknown[];
      const result = await callContract({
        address: callAddress as Address,
        data: encodeContractCall({
          abi,
          functionName: callFunction,
          args,
        }),
        value: BigInt(callValue ?? "0"),
      });

      setCallStatus(
        `Call submitted${result.blockHash ? ` in block ${result.blockHash}` : "."}`
      );
    } catch (callError) {
      setCallStatus(
        callError instanceof Error ? callError.message : "Write call failed"
      );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Deploy console
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Compile, instantiate, and call through Revive
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
          This console stays focused on the hackathon workflows we actually
          need: compile bundled ReviveSafe contracts or pasted Solidity,
          instantiate with `pallet_revive.instantiateWithCode`, then issue
          follow-up write calls through `pallet_revive.call`.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.08fr,0.92fr]">
        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>1. Prepare an artifact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              {([
                ["bundled", "Bundled"],
                ["source", "Paste Source"],
                ["artifact", "Upload Artifact"],
              ] as const).map(([nextMode, label]) => (
                <button
                  key={nextMode}
                  type="button"
                  className={`rounded-full px-3 py-1.5 ${
                    mode === nextMode ? "bg-white text-slate-950 shadow-sm" : "text-slate-500"
                  }`}
                  onClick={() => setMode(nextMode)}
                >
                  {label}
                </button>
              ))}
            </div>

            {mode === "bundled" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Bundled contract</Label>
                  <select
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
                    value={bundledContractName}
                    onChange={(event) => setBundledContractName(event.target.value)}
                  >
                    <option value="MultiSigFactory">MultiSigFactory</option>
                    <option value="MultiSigWallet">MultiSigWallet</option>
                  </select>
                </div>
                <Button className="rounded-xl" onClick={() => void compileBundledContract()}>
                  Compile bundled contracts
                </Button>
              </div>
            )}

            {mode === "source" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>File name</Label>
                    <Input
                      value={sourceFileName}
                      onChange={(event) => setSourceFileName(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contract name</Label>
                    <Input
                      value={sourceContractName}
                      onChange={(event) => setSourceContractName(event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Solidity source</Label>
                  <Textarea
                    className="min-h-[240px] font-mono text-xs"
                    value={sourceCode}
                    onChange={(event) => setSourceCode(event.target.value)}
                  />
                </div>
                <Button className="rounded-xl" onClick={() => void compileCustomSource()}>
                  Compile source
                </Button>
              </div>
            )}

            {mode === "artifact" && (
              <div className="space-y-4">
                <BytesInput
                  label="Bytecode"
                  value={artifactBytecode}
                  onChange={setArtifactBytecode}
                  description="Paste or upload the compiled contract bytecode."
                />
                <div className="space-y-2">
                  <Label>ABI JSON</Label>
                  <Textarea
                    className="min-h-[220px] font-mono text-xs"
                    value={artifactAbiText}
                    onChange={(event) => setArtifactAbiText(event.target.value)}
                  />
                </div>
              </div>
            )}

            {compileOutput && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                {compileOutput}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>2. Instantiate via Revive</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BalanceInput
              label="Instantiation value"
              value={deployValue}
              onChange={(value) => setDeployValue(value ?? "0")}
              symbol={token.symbol}
              decimals={token.decimals}
              description="RelayCode-style balance input for `instantiateWithCode.value`."
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AmountInput
                label="Weight refTime"
                value={weightRefTime}
                onChange={(value) => setWeightRefTime(value ?? "0")}
                allowHex
              />
              <AmountInput
                label="Weight proofSize"
                value={weightProofSize}
                onChange={(value) => setWeightProofSize(value ?? "0")}
                allowHex
              />
            </div>

            <OptionInput
              label="Storage deposit limit"
              description="Optional revive storage deposit limit."
              valueEnabled={storageDepositEnabled}
              onToggle={(enabled) => {
                setStorageDepositEnabled(enabled);
                if (!enabled) {
                  setStorageDeposit(undefined);
                }
              }}
            >
              <BalanceInput
                label="Storage deposit"
                value={storageDeposit}
                onChange={setStorageDeposit}
                symbol={token.symbol}
                decimals={token.decimals}
              />
            </OptionInput>

            <OptionInput
              label="Salt"
              description="Optional `Option<[u8; 32]>` salt using the RelayCode-style bytes input."
              valueEnabled={saltEnabled}
              onToggle={(enabled) => {
                setSaltEnabled(enabled);
                if (!enabled) {
                  setSalt(undefined);
                }
              }}
            >
              <BytesInput
                label="Salt bytes"
                value={salt}
                onChange={setSalt}
                description="Provide 32 bytes when you need deterministic CREATE2-style deployment."
              />
            </OptionInput>

            <div className="space-y-2">
              <Label>Constructor args JSON</Label>
              <Textarea
                className="min-h-[92px] font-mono text-xs"
                value={constructorArgsText}
                onChange={(event) => setConstructorArgsText(event.target.value)}
              />
            </div>

            {(deployStatus || error) && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 whitespace-pre-wrap">
                {deployStatus || error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-xl"
                disabled={isSubmitting || !resolvedArtifact}
                onClick={() => void deploy()}
              >
                {isSubmitting ? "Submitting..." : "Instantiate with code"}
              </Button>
              {isAddress(callAddress) && (
                <Button
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setFactoryAddress(callAddress)}
                >
                  Set active factory
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[24px] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>3. Post-deploy write call</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-[0.8fr,1.2fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Contract address</Label>
              <Input
                className="font-mono"
                value={callAddress}
                onChange={(event) => setCallAddress(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>ABI JSON</Label>
              <Textarea
                className="min-h-[220px] font-mono text-xs"
                value={callAbiText}
                onChange={(event) => setCallAbiText(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Writable function</Label>
              <select
                className="flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm shadow-sm"
                value={callFunction}
                onChange={(event) => setCallFunction(event.target.value)}
              >
                <option value="">Select a function</option>
                {writableFunctions.map((item) => (
                  <option key={item.name} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label>Args JSON array</Label>
              <Textarea
                className="min-h-[120px] font-mono text-xs"
                value={callArgsText}
                onChange={(event) => setCallArgsText(event.target.value)}
              />
            </div>

            <BalanceInput
              label="Call value"
              value={callValue}
              onChange={(value) => setCallValue(value ?? "0")}
              symbol={token.symbol}
              decimals={token.decimals}
            />

            {callStatus && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                {callStatus}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-xl"
                disabled={isSubmitting || !callFunction}
                onClick={() => void submitWriteCall()}
              >
                {isSubmitting ? "Submitting..." : "Submit write call"}
              </Button>
              {factoryAddress && (
                <div className="rounded-full bg-slate-100 px-3 py-2 text-xs font-mono text-slate-600">
                  Active factory: {factoryAddress}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

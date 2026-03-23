import { useMemo, useState } from "react";
import { Abi, AbiFunction, type Address, type Hex, isAddress } from "viem";

import bundledFactorySource from "../../../contracts/ReviveFactory.sol?raw";
import bundledWalletSource from "../../../contracts/ReviveMultisig.sol?raw";

import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
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
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
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
  const { client, loading: clientLoading, error: clientError } = usePolkadotClient();
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
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Contract tools
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Operator setup and contract tools
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Use one flow to prepare an artifact, deploy it through Revive, and
          send follow-up write calls. Most beta users should not need this page
          once a factory is already configured.
        </p>
      </div>

      <PublicBetaNotice compact />
      {clientError && (
        <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Contract deployments and write calls are unavailable until ReviveSafe
          reconnects to the selected network.
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-zinc-950 dark:text-white">
              1. Choose a contract source
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="inline-flex rounded-full border border-zinc-200 bg-zinc-50 p-1 text-xs font-semibold dark:border-white/10 dark:bg-white/[0.03]">
              {([
                ["bundled", "ReviveSafe"],
                ["source", "Source Code"],
                ["artifact", "Artifact"],
              ] as const).map(([nextMode, label]) => (
                <button
                  key={nextMode}
                  type="button"
                  className={`rounded-full px-3 py-1.5 ${
                    mode === nextMode
                      ? "bg-white text-zinc-950 shadow-sm dark:bg-white dark:text-black"
                      : "text-zinc-500 dark:text-zinc-400"
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
                  <Label className="text-zinc-700 dark:text-zinc-300">Built-in contract</Label>
                  <select
                    className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    value={bundledContractName}
                    onChange={(event) => setBundledContractName(event.target.value)}
                  >
                    <option value="MultiSigFactory">MultiSigFactory</option>
                    <option value="MultiSigWallet">MultiSigWallet</option>
                  </select>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Start with the factory or wallet contract already bundled in
                    ReviveSafe.
                  </p>
                </div>
                <Button className="rounded-full px-5" onClick={() => void compileBundledContract()}>
                  Compile selected contract
                </Button>
              </div>
            )}

            {mode === "source" && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">File name</Label>
                    <Input
                      className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                      placeholder="Contract.sol"
                      value={sourceFileName}
                      onChange={(event) => setSourceFileName(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-700 dark:text-zinc-300">Contract name</Label>
                    <Input
                      className="h-11 rounded-2xl border-zinc-200 bg-white dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                      placeholder="Counter"
                      value={sourceContractName}
                      onChange={(event) => setSourceContractName(event.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-700 dark:text-zinc-300">Solidity source</Label>
                  <Textarea
                    className="min-h-[240px] rounded-2xl border-zinc-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    value={sourceCode}
                    onChange={(event) => setSourceCode(event.target.value)}
                  />
                </div>
                <Button className="rounded-full px-5" onClick={() => void compileCustomSource()}>
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
                  <Label className="text-zinc-700 dark:text-zinc-300">ABI JSON</Label>
                  <Textarea
                    className="min-h-[220px] rounded-2xl border-zinc-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                    value={artifactAbiText}
                    onChange={(event) => setArtifactAbiText(event.target.value)}
                  />
                </div>
              </div>
            )}

            {compileOutput && (
              <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
                {compileOutput}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-zinc-950 dark:text-white">
              2. Deploy through Revive
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <BalanceInput
              label="Deployment value"
              value={deployValue}
              onChange={(value) => setDeployValue(value ?? "0")}
              symbol={token.symbol}
              decimals={token.decimals}
              description="Native value sent with the deployment."
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
              description="Optional cap for storage deposit during deployment."
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
              description="Optional salt when you need deterministic deployment."
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
                description="Provide 32 bytes only if you need a deterministic deployment salt."
              />
            </OptionInput>

            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">Constructor args JSON</Label>
              <Textarea
                className="min-h-[92px] rounded-2xl border-zinc-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                value={constructorArgsText}
                onChange={(event) => setConstructorArgsText(event.target.value)}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter a JSON array in the same order as the constructor inputs.
              </p>
            </div>

            {(deployStatus || error) && (
              <div className="whitespace-pre-wrap rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
                {deployStatus || error}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full px-5"
                disabled={
                  isSubmitting || !resolvedArtifact || clientLoading || !client || !!clientError
                }
                onClick={() => void deploy()}
              >
                {isSubmitting
                  ? "Submitting..."
                  : clientLoading
                    ? "Waiting for network..."
                    : clientError || !client
                      ? "Network connection required"
                      : "Deploy contract"}
              </Button>
              {isAddress(callAddress) && (
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-200 bg-white px-5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                  onClick={() => setFactoryAddress(callAddress)}
                >
                  Use as active factory
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader>
          <CardTitle className="text-zinc-950 dark:text-white">
            3. Send a write call
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">Contract address</Label>
              <Input
                className="h-11 rounded-2xl border-zinc-200 bg-white font-mono dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                placeholder="0x..."
                value={callAddress}
                onChange={(event) => setCallAddress(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">ABI JSON</Label>
              <Textarea
                className="min-h-[220px] rounded-2xl border-zinc-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                value={callAbiText}
                onChange={(event) => setCallAbiText(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-700 dark:text-zinc-300">Writable function</Label>
              <select
                className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
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
              <Label className="text-zinc-700 dark:text-zinc-300">Args JSON array</Label>
              <Textarea
                className="min-h-[120px] rounded-2xl border-zinc-200 bg-white font-mono text-xs dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                value={callArgsText}
                onChange={(event) => setCallArgsText(event.target.value)}
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Enter the function arguments as a JSON array in ABI order.
              </p>
            </div>

            <BalanceInput
              label="Call value"
              value={callValue}
              onChange={(value) => setCallValue(value ?? "0")}
              symbol={token.symbol}
              decimals={token.decimals}
              description="Native value to send alongside this write call."
            />

            {callStatus && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
                {callStatus}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full px-5"
                disabled={
                  isSubmitting || !callFunction || clientLoading || !client || !!clientError
                }
                onClick={() => void submitWriteCall()}
              >
                {isSubmitting
                  ? "Submitting..."
                  : clientLoading
                    ? "Waiting for network..."
                    : clientError || !client
                      ? "Network connection required"
                      : "Send write call"}
              </Button>
              {factoryAddress && (
                <div className="rounded-full bg-zinc-100 px-3 py-2 text-xs font-mono text-zinc-600 dark:bg-white/[0.06] dark:text-zinc-300">
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

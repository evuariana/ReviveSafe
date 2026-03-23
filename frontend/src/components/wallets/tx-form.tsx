import { useMemo, useState } from "react";
import { Coins, Plus, Sparkles } from "lucide-react";
import { isAddress, type Address, type Hex } from "viem";

import { AssetAmountInput } from "@/components/inputs/asset-amount-input";
import { BalanceInput } from "@/components/inputs/balance-input";
import { BytesInput } from "@/components/inputs/bytes-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import {
  WorkspaceBadge,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceOutlineButtonClassName,
  workspaceSelectClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssetBalances } from "@/hooks/useHubAssetBalances";
import { useHubAssets } from "@/hooks/useHubAssets";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveWallet } from "@/hooks/useReviveWallet";

type ProposalMode = "native" | "asset";
const EMPTY_ASSETS = [] as const;

interface NewTransactionFormProps {
  walletAddress: Address;
  onTransactionSubmitted?: () => void;
}

export default function NewTransactionForm({
  walletAddress,
  onTransactionSubmitted,
}: NewTransactionFormProps) {
  const wallet = useReviveWallet(walletAddress);
  const token = useChainToken();
  const { client, loading: clientLoading, error: clientError } = usePolkadotClient();
  const assetsQuery = useHubAssets();
  const assets = assetsQuery.data ?? EMPTY_ASSETS;
  const assetBalancesQuery = useHubAssetBalances(walletAddress);
  const assetBalances = assetBalancesQuery.balances;
  const writeUnavailableReason = clientLoading
    ? "Waiting for the active network runtime."
    : clientError || !client
      ? "ReviveSafe cannot submit contract actions until the network connection recovers."
      : undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ProposalMode>("native");
  const [destination, setDestination] = useState<Address | undefined>();
  const [nativeAmount, setNativeAmount] = useState<string>();
  const [data, setData] = useState<Hex | undefined>();
  const [selectedAssetId, setSelectedAssetId] = useState<string>("");
  const [assetAmount, setAssetAmount] = useState<string>();
  const [error, setError] = useState<string>();

  const selectedAsset = useMemo(
    () => assets.find((asset) => asset.id === Number(selectedAssetId)),
    [assets, selectedAssetId]
  );
  const selectedAssetBalance = useMemo(
    () => assetBalances.find((asset) => asset.id === Number(selectedAssetId)),
    [assetBalances, selectedAssetId]
  );

  const reset = () => {
    setDestination(undefined);
    setNativeAmount(undefined);
    setData(undefined);
    setAssetAmount(undefined);
    setSelectedAssetId("");
    setError(undefined);
  };

  const submit = async () => {
    if (!destination || !isAddress(destination)) {
      setError("Enter a valid recipient address.");
      return;
    }

    try {
      setError(undefined);

      if (mode === "native") {
        const amount = BigInt(nativeAmount ?? "0");
        const hasCallData = !!data && data !== "0x";

        if (amount <= 0n && !hasCallData) {
          throw new Error("Enter an amount or provide calldata for this proposal.");
        }

        await wallet.submitTransaction({
          destination,
          value: amount,
          data: data ?? "0x",
        });
      } else {
        if (assetsQuery.error) {
          throw new Error("Asset metadata could not be loaded from the active network.");
        }

        if (assetsQuery.isLoading) {
          throw new Error("Asset metadata is still loading from the active network.");
        }

        if (!selectedAsset) {
          throw new Error("Select an asset precompile first");
        }

        const amount = BigInt(assetAmount ?? "0");
        if (amount <= 0n) {
          throw new Error("Enter an asset amount greater than zero.");
        }

        await wallet.submitAssetTransfer({
          assetId: selectedAsset.id,
          destination,
          amount,
        });
      }

      reset();
      setIsOpen(false);
      onTransactionSubmitted?.();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit transaction"
      );
    }
  };

  if (!isOpen) {
    return (
      <WorkspacePanel
        title="Create a proposal"
        description="Draft a new programmable wallet proposal without leaving the wallet context."
      >
        <Button className="w-full rounded-full" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Create proposal
        </Button>
      </WorkspacePanel>
    );
  }

  return (
    <WorkspacePanel
      title="Create a proposal"
      description="Choose whether this programmable wallet should send the chain token or an Asset Hub asset."
      contentClassName="space-y-5"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          className={`rounded-[24px] border px-4 py-4 text-left transition duration-300 ease-premium ${
            mode === "native"
              ? "border-zinc-950 bg-zinc-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white dark:bg-white dark:text-black"
              : "border-black/10 bg-white/80 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
          }`}
          onClick={() => setMode("native")}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4" />
            Native transfer
          </div>
          <p className="mt-2 text-xs leading-6 opacity-80">
            Send the chain token, with optional calldata if this action needs it.
          </p>
        </button>

        <button
          type="button"
          className={`rounded-[24px] border px-4 py-4 text-left transition duration-300 ease-premium ${
            mode === "asset"
              ? "border-zinc-950 bg-zinc-950 text-white shadow-[0_18px_40px_rgba(15,23,42,0.12)] dark:border-white dark:bg-white dark:text-black"
              : "border-black/10 bg-white/80 text-zinc-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-zinc-300"
          }`}
          onClick={() => setMode("asset")}
        >
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Coins className="h-4 w-4" />
            Asset transfer
          </div>
          <p className="mt-2 text-xs leading-6 opacity-80">
            Move an Asset Hub token through its deterministic precompile.
          </p>
        </button>
      </div>

      <MappedAccountInput
        label="Recipient"
        value={destination}
        onChange={setDestination}
        description="Choose a connected address or paste any valid H160 recipient."
      />

      {mode === "native" ? (
        <>
          <BalanceInput
            label={`Amount (${token.symbol})`}
            value={nativeAmount}
            onChange={setNativeAmount}
            symbol={token.symbol}
            decimals={token.decimals}
            maxPlanck={wallet.balance}
            description="Amount to send from the wallet's native balance."
          />
          <BytesInput
            label="Optional calldata"
            value={data}
            onChange={setData}
            description="Provide bytes only when the recipient contract expects extra call data."
          />
        </>
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">Asset</Label>
            <select
              className={workspaceSelectClassName}
              value={selectedAssetId}
              disabled={assetsQuery.isLoading || !!assetsQuery.error}
              onChange={(event) => setSelectedAssetId(event.target.value)}
            >
              <option value="">
                {assetsQuery.isLoading
                  ? "Loading assets..."
                  : assetsQuery.error
                    ? "Asset metadata unavailable"
                    : "Select an asset"}
              </option>
              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol || asset.name} (#{asset.id})
                </option>
              ))}
            </select>
            {assetsQuery.error ? (
              <p className="text-xs text-rose-600 dark:text-rose-400">
                {assetsQuery.error instanceof Error
                  ? assetsQuery.error.message
                  : "Asset metadata could not be loaded from the active network."}
              </p>
            ) : null}
          </div>

          <AssetAmountInput
            asset={selectedAsset}
            value={assetAmount}
            onChange={setAssetAmount}
            maxBalance={selectedAssetBalance?.balance}
          />
        </>
      )}

      <div className="flex flex-wrap gap-2">
        <WorkspaceBadge tone={mode === "native" ? "default" : "sky"}>
          {mode === "native" ? "Programmable native transfer" : "Programmable asset transfer"}
        </WorkspaceBadge>
      </div>

      {writeUnavailableReason ? (
        <WorkspaceNotice tone="amber">{writeUnavailableReason}</WorkspaceNotice>
      ) : null}
      {error ? <WorkspaceNotice tone="rose">{error}</WorkspaceNotice> : null}

      <div className="flex flex-wrap gap-3">
        <Button disabled={wallet.isLoading || !!writeUnavailableReason} onClick={() => void submit()}>
          Submit for approval
        </Button>
        <Button
          type="button"
          variant="outline"
          className={workspaceOutlineButtonClassName}
          onClick={() => {
            reset();
            setIsOpen(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </WorkspacePanel>
  );
}

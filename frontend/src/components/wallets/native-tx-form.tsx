import { useMemo, useState } from "react";
import { Coins, Plus } from "lucide-react";

import { AssetAmountInput } from "@/components/inputs/asset-amount-input";
import { BalanceInput } from "@/components/inputs/balance-input";
import {
  WorkspaceBadge,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceOutlineButtonClassName,
  workspaceSelectClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChainToken } from "@/hooks/useChainToken";
import {
  useNativeMultisigActions,
  useNativeMultisigWallet,
} from "@/hooks/useNativeMultisig";
import type { ImportedNativeWalletRecord } from "@/types/revive";

type NativeProposalMode = "asset" | "native";

export function NativeProposalForm({
  wallet,
}: {
  wallet: ImportedNativeWalletRecord;
}) {
  const [destination, setDestination] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<NativeProposalMode>("native");
  const [nativeAmount, setNativeAmount] = useState<string>();
  const [assetId, setAssetId] = useState("");
  const [assetAmount, setAssetAmount] = useState<string>();
  const [error, setError] = useState<string>();
  const actions = useNativeMultisigActions(wallet);
  const nativeWallet = useNativeMultisigWallet(wallet);
  const token = useChainToken();
  const assetBalances = nativeWallet.assetBalances;

  const selectedAsset = useMemo(
    () => assetBalances.find((asset) => asset.id === Number(assetId)),
    [assetBalances, assetId]
  );

  const reset = () => {
    setAssetAmount(undefined);
    setAssetId("");
    setDestination("");
    setError(undefined);
    setNativeAmount(undefined);
  };

  const submit = async () => {
    if (!destination.trim()) {
      setError("Enter a valid recipient address.");
      return;
    }

    try {
      setError(undefined);

      if (mode === "native") {
        const amount = BigInt(nativeAmount ?? "0");
        if (amount <= 0n) {
          throw new Error("Enter an amount greater than zero.");
        }

        await actions.submitNativeTransfer(destination.trim(), amount);
      } else {
        const amount = BigInt(assetAmount ?? "0");
        if (!selectedAsset) {
          throw new Error("Select an asset first.");
        }

        if (amount <= 0n) {
          throw new Error("Enter an asset amount greater than zero.");
        }

        await actions.submitAssetTransfer(
          selectedAsset.id,
          destination.trim(),
          amount
        );
      }

      reset();
      setIsOpen(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit native proposal."
      );
    }
  };

  if (!isOpen) {
    return (
      <WorkspacePanel
        title="Create native proposal"
        description="Draft a new action for this imported native wallet."
      >
        <Button className="w-full rounded-full" onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4" />
          Create native proposal
        </Button>
      </WorkspacePanel>
    );
  }

  return (
    <WorkspacePanel
      title="Create native proposal"
      description="Supported actions stay intentionally smaller here, so the choices are simple and explicit."
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
          <div className="text-sm font-semibold">Native transfer</div>
          <p className="mt-2 text-xs leading-6 opacity-80">
            Send the main network token from this wallet.
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
            Send an Asset Hub token from this wallet.
          </p>
        </button>
      </div>

      <div className="space-y-2">
        <Label className="text-zinc-700 dark:text-zinc-300">Recipient address</Label>
        <Input
          className="h-12 rounded-[18px] border-black/10 bg-white/88 dark:border-white/10 dark:bg-white/[0.04] dark:text-white"
          placeholder="1..."
          value={destination}
          onChange={(event) => setDestination(event.target.value)}
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Use the regular Polkadot address that should receive funds from this wallet.
        </p>
      </div>

      {mode === "native" ? (
        <BalanceInput
          label="Amount"
          value={nativeAmount}
          onChange={setNativeAmount}
          symbol={token.symbol}
          decimals={token.decimals}
          maxPlanck={nativeWallet.balance}
          description="Amount to send from this wallet."
        />
      ) : (
        <>
          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">Asset</Label>
            <select
              className={workspaceSelectClassName}
              value={assetId}
              onChange={(event) => setAssetId(event.target.value)}
            >
              <option value="">Select an asset</option>
              {assetBalances.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.symbol || asset.name} (#{asset.id})
                </option>
              ))}
            </select>
          </div>

          <AssetAmountInput
            asset={selectedAsset}
            value={assetAmount}
            onChange={setAssetAmount}
            maxBalance={selectedAsset?.balance}
          />
        </>
      )}

      <WorkspaceBadge tone="sky">
        {mode === "native" ? "Native wallet transfer" : "Native wallet asset transfer"}
      </WorkspaceBadge>

      {error || actions.error ? (
        <WorkspaceNotice tone="rose">{error || actions.error}</WorkspaceNotice>
      ) : null}

      <div className="flex gap-2">
        <Button
          className="flex-1 rounded-full"
          disabled={actions.isSubmitting}
          onClick={() => void submit()}
        >
          {actions.isSubmitting ? "Submitting..." : "Submit for approval"}
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

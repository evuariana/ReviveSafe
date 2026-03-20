import { useMemo, useState } from "react";
import { AlertCircle, Coins, Plus, Sparkles } from "lucide-react";
import { isAddress, type Address, type Hex } from "viem";

import { AssetAmountInput } from "@/components/inputs/asset-amount-input";
import { BalanceInput } from "@/components/inputs/balance-input";
import { BytesInput } from "@/components/inputs/bytes-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useChainToken } from "@/hooks/useChainToken";
import { useHubAssetBalances } from "@/hooks/useHubAssetBalances";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useReviveWallet } from "@/hooks/useReviveWallet";

type ProposalMode = "native" | "asset";

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
  const { data: assets = [] } = useHubAssets();
  const { balances: assetBalances } = useHubAssetBalances(walletAddress);

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
        await wallet.submitTransaction({
          destination,
          value: BigInt(nativeAmount ?? "0"),
          data: data ?? "0x",
        });
      } else {
        if (!selectedAsset) {
          throw new Error("Select an asset precompile first");
        }

        await wallet.submitAssetTransfer({
          assetId: selectedAsset.id,
          destination,
          amount: BigInt(assetAmount ?? "0"),
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
      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardContent className="p-6">
          <Button className="w-full rounded-full" onClick={() => setIsOpen(true)}>
            <Plus className="h-4 w-4" />
            Create proposal
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      <CardHeader>
        <CardTitle className="text-zinc-950 dark:text-white">Create a proposal</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              mode === "native"
                ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-zinc-200 bg-white text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
            }`}
            onClick={() => setMode("native")}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Sparkles className="h-4 w-4" />
              Native transfer
            </div>
            <p className="mt-2 text-xs opacity-80">
              Send the chain token, with optional calldata if this action needs it.
            </p>
          </button>

          <button
            type="button"
            className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
              mode === "asset"
                ? "border-zinc-950 bg-zinc-950 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-zinc-200 bg-white text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300"
            }`}
            onClick={() => setMode("asset")}
          >
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Coins className="h-4 w-4" />
              Asset transfer
            </div>
            <p className="mt-2 text-xs opacity-80">
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
                className="flex h-11 w-full rounded-2xl border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
                value={selectedAssetId}
                onChange={(event) => setSelectedAssetId(event.target.value)}
              >
                <option value="">Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.symbol || asset.name} (#{asset.id})
                  </option>
                ))}
              </select>
              {selectedAsset && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {selectedAsset.name} will use precompile {selectedAsset.precompileAddress}
                </p>
              )}
            </div>

            <AssetAmountInput
              asset={selectedAsset}
              value={assetAmount}
              onChange={setAssetAmount}
              maxBalance={selectedAssetBalance?.balance}
            />
          </>
        )}

        {(error || wallet.error) && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle className="h-4 w-4" />
            {error || wallet.error}
          </div>
        )}

        <div className="flex gap-2">
          <Button
            className="flex-1 rounded-full"
            disabled={wallet.isSubmitting}
            onClick={() => void submit()}
          >
            {wallet.isSubmitting ? "Submitting..." : "Submit for approval"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
            onClick={() => {
              reset();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

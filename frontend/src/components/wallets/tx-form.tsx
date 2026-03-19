// src/components/wallets/tx-form.tsx
import { useState } from "react";
import { AlertCircle, Coins, Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { useHubAssets } from "@/hooks/useHubAssets";
import { Address, isAddress, parseEther, parseUnits } from "viem";

type ProposalMode = "native" | "asset";

interface NewTransactionFormProps {
  walletAddress: Address;
  onTransactionSubmitted?: () => void; // Callback when transaction is submitted
}

export default function NewTransactionForm({
  walletAddress,
  onTransactionSubmitted,
}: NewTransactionFormProps) {
  const { submitTransaction, submitAssetTransfer } = useReviveWallet(
    walletAddress
  );
  const { data: assets = [] } = useHubAssets();
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<ProposalMode>("native");
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState("");
  const [assetId, setAssetId] = useState<string>("1984");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedAsset =
    assets.find((asset) => asset.id === Number(assetId)) ?? assets[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAddress(destination)) {
      setError("Enter a valid destination address");
      return;
    }

    try {
      setIsSubmitting(true);

      if (mode === "native") {
        const value = parseEther(amount || "0");
        await submitTransaction(
          destination as Address,
          value,
          (data || "0x") as `0x${string}`
        );
      } else {
        const parsedAssetId = Number(assetId);
        if (!Number.isInteger(parsedAssetId)) {
          throw new Error("Asset ID must be a whole number");
        }

        const decimals = selectedAsset?.decimals ?? 0;
        await submitAssetTransfer(
          parsedAssetId,
          destination as Address,
          parseUnits(amount || "0", decimals)
        );
      }

      // Reset form
      setDestination("");
      setAmount("");
      setData("");
      setError("");
      setIsOpen(false);

      // Trigger parent refresh after a delay to allow blockchain to update
      setTimeout(() => {
        onTransactionSubmitted?.();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit transaction:", error);
      setError(
        error instanceof Error ? error.message : "Failed to submit proposal"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Card>
        <CardContent className="p-6">
          <Button onClick={() => setIsOpen(true)} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            New Transaction
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit New Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMode("native")}
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                mode === "native"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Native transfer
              </div>
              <p className="mt-1 text-xs text-gray-600">Send PAS or raw call data</p>
            </button>
            <button
              type="button"
              onClick={() => setMode("asset")}
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                mode === "asset"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <Coins className="h-4 w-4" />
                Asset precompile
              </div>
              <p className="mt-1 text-xs text-gray-600">
                Use the pallet-assets ERC-20 precompile
              </p>
            </button>
          </div>

          <div>
            <Label htmlFor="destination">Destination Address</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="0x..."
              className="font-mono"
              required
            />
          </div>

          {mode === "asset" && (
            <div>
              <Label htmlFor="asset-id">Asset ID</Label>
              <Input
                id="asset-id"
                value={assetId}
                onChange={(event) => setAssetId(event.target.value)}
                placeholder="1984"
              />
              {selectedAsset && (
                <p className="mt-1 text-xs text-gray-600">
                  {selectedAsset.name} ({selectedAsset.symbol || `#${selectedAsset.id}`})
                  {" "}via {selectedAsset.precompileAddress}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="amount">
              Amount {mode === "asset" && selectedAsset ? `(${selectedAsset.symbol})` : "(PAS)"}
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </div>

          {mode === "native" && (
            <div>
              <Label htmlFor="data">Data (optional)</Label>
              <Input
                id="data"
                value={data}
                onChange={(e) => setData(e.target.value)}
                placeholder="0x..."
                className="font-mono"
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Proposal"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

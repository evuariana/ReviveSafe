// src/components/wallets/tx-form.tsx
import { useState } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { Address, parseEther } from "viem";

interface NewTransactionFormProps {
  walletAddress: Address;
  onTransactionSubmitted?: () => void; // Callback when transaction is submitted
}

export default function NewTransactionForm({
  walletAddress,
  onTransactionSubmitted,
}: NewTransactionFormProps) {
  const { submitTransaction } = useReviveWallet(walletAddress);
  const [isOpen, setIsOpen] = useState(false);
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [data, setData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const value = parseEther(amount || "0");
      await submitTransaction(
        destination as Address,
        value,
        (data || "0x") as `0x${string}`
      );

      // Reset form
      setDestination("");
      setAmount("");
      setData("");
      setIsOpen(false);

      // Trigger parent refresh after a delay to allow blockchain to update
      setTimeout(() => {
        onTransactionSubmitted?.();
      }, 2000);
    } catch (error) {
      console.error("Failed to submit transaction:", error);
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

          <div>
            <Label htmlFor="amount">Amount (WND)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
            />
          </div>

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

          <div className="flex gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Submitting..." : "Submit Transaction"}
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

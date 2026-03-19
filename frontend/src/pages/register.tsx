import { useState } from "react";
import { motion } from "framer-motion";
import { isAddress, type Address } from "viem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviveFactory } from "@/hooks/useReviveFactory";

export default function RegisterMultisig() {
  const { registerMultisig, isRegistering, registerSuccess, isFactoryAvailable } =
    useReviveFactory();
  const [multisigAddress, setMultisigAddress] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!isAddress(multisigAddress)) {
      setError("Enter a valid deployed multisig address");
      return;
    }

    setError("");

    try {
      await registerMultisig(multisigAddress as Address);
      setMultisigAddress("");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to register multisig"
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto space-y-8"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Register Existing Multisig
        </h1>
        <p className="text-gray-600 mt-2">
          Import a deployed ReviveSafe wallet so it appears in your dashboard
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Register Multisig
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isFactoryAvailable && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
              Set `VITE_FACTORY_ADDRESS` to the deployed factory before using
              registration.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="multisig-address">Multisig Address</Label>
              <Input
                id="multisig-address"
                value={multisigAddress}
                onChange={(event) => setMultisigAddress(event.target.value)}
                className="font-mono"
                placeholder="0x..."
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            {registerSuccess && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="h-4 w-4" />
                Multisig registered successfully.
              </div>
            )}

            <Button
              type="submit"
              disabled={!isFactoryAvailable || isRegistering}
              className="w-full"
            >
              {isRegistering ? "Registering..." : "Register Multisig"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

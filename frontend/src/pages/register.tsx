import { useState } from "react";
import { Link } from "react-router-dom";
import { isAddress, type Address } from "viem";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useReviveFactory } from "@/hooks/useReviveFactory";

export default function RegisterMultisig() {
  const { registerMultisig, isRegistering, registerSuccess, isFactoryAvailable, error } =
    useReviveFactory();
  const [multisigAddress, setMultisigAddress] = useState("");
  const [submitError, setSubmitError] = useState<string>();

  const submit = async () => {
    if (!isFactoryAvailable) {
      setSubmitError("Deploy or set a factory address before registering a wallet.");
      return;
    }

    if (!isAddress(multisigAddress)) {
      setSubmitError("Enter a valid H160 contract address.");
      return;
    }

    try {
      setSubmitError(undefined);
      await registerMultisig(multisigAddress as Address);
      setMultisigAddress("");
    } catch (registerError) {
      setSubmitError(
        registerError instanceof Error
          ? registerError.message
          : "Failed to register multisig"
      );
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Register multisig
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Add an existing ReviveSafe wallet
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Registration now calls the factory contract through `pallet_revive.call`
          using your mapped account identity.
        </p>
      </div>

      <Card className="rounded-[24px] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Wallet address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isFactoryAvailable && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              No active factory is configured yet.
              <div className="mt-3">
                <Link to="/deploy">
                  <Button variant="outline" className="rounded-xl border-amber-300">
                    Open deploy console
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Multisig contract address</Label>
            <Input
              className="font-mono"
              placeholder="0x..."
              value={multisigAddress}
              onChange={(event) => setMultisigAddress(event.target.value)}
            />
          </div>

          {(submitError || error) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {submitError || error}
            </div>
          )}

          {registerSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Multisig registered successfully.
            </div>
          )}

          <Button
            className="rounded-xl"
            disabled={!isFactoryAvailable || isRegistering}
            onClick={() => void submit()}
          >
            {isRegistering ? "Registering..." : "Register multisig"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

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
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Add contract wallet
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Add an existing contract wallet to this workspace
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Register an already deployed contract wallet so your team can review
          balances, approvals, and proposal history from the same app. Native
          wallet import is not part of the current testnet demo yet.
        </p>
      </div>

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader>
          <CardTitle className="text-zinc-950 dark:text-white">Wallet address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isFactoryAvailable && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              No active factory is configured yet. Add one before you register a
              wallet in this workspace.
              <div className="mt-3">
                <Link to="/deploy">
                  <Button variant="outline" className="rounded-xl border-amber-300">
                    Open contract tools
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">Wallet contract address</Label>
            <Input
              className="h-11 rounded-2xl border-zinc-200 bg-white font-mono dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
              placeholder="0x..."
              value={multisigAddress}
              onChange={(event) => setMultisigAddress(event.target.value)}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              This does not redeploy or change the wallet. It only adds it to
              your ReviveSafe workspace.
            </p>
          </div>

          {(submitError || error) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {submitError || error}
            </div>
          )}

          {registerSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Contract wallet added. You can now open it from the wallets page.
            </div>
          )}

          <Button
            className="rounded-full px-5"
            disabled={!isFactoryAvailable || isRegistering}
            onClick={() => void submit()}
          >
            {isRegistering ? "Adding..." : "Add contract wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

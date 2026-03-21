import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAddress, type Address } from "viem";

import { reviveWalletAbi } from "@/config/contracts";
import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContractAdapter } from "@/hooks/useContractAdapter";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";

export default function RegisterMultisig() {
  const adapter = useContractAdapter();
  const { mappedAccount } = useMappedAccount();
  const { client, loading: clientLoading, error: clientError } = usePolkadotClient();
  const { registerMultisig, isRegistering, registerSuccess, isFactoryAvailable, error } =
    useReviveFactory();
  const [multisigAddress, setMultisigAddress] = useState("");
  const [submitError, setSubmitError] = useState<string>();
  const normalizedAddress = isAddress(multisigAddress)
    ? (multisigAddress as Address)
    : undefined;

  const walletCheckQuery = useQuery({
    queryKey: [
      "register-existing-wallet-check",
      normalizedAddress,
      mappedAccount?.mappedH160,
    ],
    enabled: !!normalizedAddress,
    queryFn: async () => {
      if (!normalizedAddress) {
        throw new Error("Enter a valid wallet contract address.");
      }

      try {
        const [version, owners, required, isOwner] = await Promise.all([
          adapter.read<bigint>({
            address: normalizedAddress,
            abi: reviveWalletAbi,
            functionName: "walletCoreVersion",
          }),
          adapter.read<readonly Address[]>({
            address: normalizedAddress,
            abi: reviveWalletAbi,
            functionName: "getOwners",
          }),
          adapter.read<bigint>({
            address: normalizedAddress,
            abi: reviveWalletAbi,
            functionName: "required",
          }),
          mappedAccount?.mappedH160
            ? adapter.read<boolean>({
                address: normalizedAddress,
                abi: reviveWalletAbi,
                functionName: "isOwner",
                args: [mappedAccount.mappedH160],
              })
            : Promise.resolve(false),
        ]);

        if (Number(version) < 2) {
          throw new Error("This wallet does not expose the current ReviveSafe wallet surface.");
        }

        if (owners.length === 0 || required === 0n || required > BigInt(owners.length)) {
          throw new Error("This wallet does not expose a valid owner and threshold configuration.");
        }

        return {
          version: Number(version),
          ownerCount: owners.length,
          required: Number(required),
          isOwner,
        };
      } catch (queryError) {
        const message =
          queryError instanceof Error
            ? queryError.message
            : "We could not verify this as a compatible ReviveSafe contract wallet on the active network.";

        throw new Error(
          message !== "This wallet does not expose the current ReviveSafe wallet surface." &&
            message !==
              "This wallet does not expose a valid owner and threshold configuration."
            ? "We could not verify this as a compatible ReviveSafe contract wallet on the active network."
            : message
        );
      }
    },
  });

  const submit = async () => {
    if (!isFactoryAvailable) {
      setSubmitError("Deploy or set a factory address before registering a wallet.");
      return;
    }

    if (!isAddress(multisigAddress)) {
      setSubmitError("Enter a valid H160 contract address.");
      return;
    }

    if (clientLoading || !client || clientError) {
      setSubmitError(
        "The active network is not ready for contract writes yet. Reconnect and try again."
      );
      return;
    }

    if (walletCheckQuery.isError || !walletCheckQuery.data) {
      setSubmitError("Verify the wallet on the active network before adding it.");
      return;
    }

    if (!walletCheckQuery.data.isOwner) {
      setSubmitError(
        "Switch to a connected owner account before adding this wallet to the workspace."
      );
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
          wallet import is not part of the current public beta yet.
        </p>
      </div>

      <PublicBetaNotice compact />

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
              your ReviveSafe workspace. The connected mapped account must
              already be an owner for the wallet to show up in `Wallets`.
            </p>
          </div>

          {normalizedAddress && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
              {walletCheckQuery.isLoading ? (
                "Checking wallet compatibility and owner access..."
              ) : walletCheckQuery.isError ? (
                <span className="text-rose-700 dark:text-rose-300">
                  {(walletCheckQuery.error as Error).message}
                </span>
              ) : walletCheckQuery.data?.isOwner ? (
                <>
                  Verified compatible wallet: {walletCheckQuery.data.required} of{" "}
                  {walletCheckQuery.data.ownerCount} approvals. This connected
                  account can open it after registration.
                </>
              ) : (
                <span className="text-amber-800 dark:text-amber-200">
                  This wallet looks compatible, but the connected mapped account
                  is not one of its owners. Switch to an owner account before
                  adding it here.
                </span>
              )}
            </div>
          )}

          {(submitError || error) && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {submitError || error}
            </div>
          )}
          {clientError && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              Contract writes are unavailable until ReviveSafe reconnects to the
              active network runtime.
            </div>
          )}

          {registerSuccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              Contract wallet added. You can now open it from the wallets page
              with this owner account.
            </div>
          )}

          <Button
            className="rounded-full px-5"
            disabled={
              !isFactoryAvailable ||
              isRegistering ||
              clientLoading ||
              !client ||
              !!clientError ||
              !walletCheckQuery.data?.isOwner
            }
            onClick={() => void submit()}
          >
            {isRegistering
              ? "Adding..."
              : clientLoading
                ? "Waiting for network..."
                : clientError || !client
                  ? "Network connection required"
                  : "Add contract wallet"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

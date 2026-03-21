import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { isAddress, type Address } from "viem";

import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import { AmountInput } from "@/components/inputs/amount-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";

export default function Create() {
  const navigate = useNavigate();
  const { mappedAccount } = useMappedAccount();
  const { client, loading: clientLoading, error: clientError } = usePolkadotClient();
  const { createMultisig, isCreating, createSuccess, isFactoryAvailable, error } =
    useReviveFactory();

  const [owners, setOwners] = useState<Array<Address | undefined>>([]);
  const [required, setRequired] = useState<string>("1");
  const [submitError, setSubmitError] = useState<string>();

  useEffect(() => {
    if (mappedAccount?.mappedH160 && owners.length === 0) {
      setOwners([mappedAccount.mappedH160]);
    }
  }, [mappedAccount?.mappedH160, owners.length]);

  useEffect(() => {
    if (createSuccess) {
      navigate("/wallets");
    }
  }, [createSuccess, navigate]);

  const validOwners = useMemo(
    () => owners.filter((owner): owner is Address => !!owner && isAddress(owner)),
    [owners]
  );
  const uniqueOwnerCount = useMemo(
    () => new Set(validOwners.map((owner) => owner.toLowerCase())).size,
    [validOwners]
  );

  const requiredNumber = Number(required || 0);

  const submit = async () => {
    if (!isFactoryAvailable) {
      setSubmitError("Deploy or set a factory address before creating a multisig.");
      return;
    }

    if (validOwners.length === 0) {
      setSubmitError("Add at least one owner.");
      return;
    }

    if (uniqueOwnerCount !== validOwners.length) {
      setSubmitError("Each owner must be unique.");
      return;
    }

    if (!requiredNumber || requiredNumber > validOwners.length) {
      setSubmitError("Threshold must be between 1 and the owner count.");
      return;
    }

    if (clientLoading || !client || clientError) {
      setSubmitError(
        "The active network is not ready for contract writes yet. Reconnect and try again."
      );
      return;
    }

    try {
      setSubmitError(undefined);
      await createMultisig({
        owners: validOwners,
        required: requiredNumber,
      });
    } catch (createError) {
      setSubmitError(
        createError instanceof Error
          ? createError.message
          : "Failed to create multisig"
      );
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Create wallet
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Set up a programmable shared wallet
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Create a new contract wallet for your team, choose who can approve
          actions, and set the threshold required before execution.
        </p>
      </div>

      <PublicBetaNotice compact />

      {!isFactoryAvailable && (
        <Card className="rounded-[24px] border-amber-200 bg-amber-50 shadow-none">
          <CardContent className="p-5 text-sm text-amber-900">
            A wallet factory is not connected yet. Open contract tools to deploy
            one or connect an existing factory before creating a wallet.
            <div className="mt-3">
              <Link to="/deploy">
                <Button variant="outline" className="rounded-xl border-amber-300">
                  Open contract tools
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader>
          <CardTitle className="text-zinc-950 dark:text-white">1. Add owners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mappedAccount?.mappedH160 && (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              Your connected account is added as the first owner by default
              using its mapped H160. You can paste either mapped H160 addresses
              or regular SS58 addresses for the other owners.
            </div>
          )}

          {owners.map((owner, index) => (
            <div
              key={`${owner ?? "empty"}-${index}`}
              className="rounded-2xl border border-zinc-200 p-4 dark:border-white/10"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Owner #{index + 1}
                </div>
                {owners.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setOwners((currentOwners) =>
                        currentOwners.filter((_, currentIndex) => currentIndex !== index)
                      )
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <MappedAccountInput
                label="Owner contract address"
                value={owner}
                onChange={(nextOwner) =>
                  setOwners((currentOwners) =>
                    currentOwners.map((currentOwner, currentIndex) =>
                      currentIndex === index ? nextOwner : currentOwner
                    )
                  )
                }
                description="Choose a connected account or paste the contract address that should be allowed to approve."
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
            onClick={() => setOwners((currentOwners) => [...currentOwners, undefined])}
          >
            <Plus className="h-4 w-4" />
            Add owner
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader>
          <CardTitle className="text-zinc-950 dark:text-white">
            2. Choose the approval rule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AmountInput
            label="Approvals required"
            value={required}
            onChange={(value) => setRequired(value ?? "1")}
            description={`For this wallet, choose how many approvals are needed out of ${Math.max(
              validOwners.length,
              1
            )} valid owners.`}
            min={1}
            max={Math.max(validOwners.length, 1)}
          />
        </CardContent>
      </Card>

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

      <div className="flex flex-wrap gap-3">
        <Button
          className="rounded-full px-5"
          disabled={isCreating || clientLoading || !client || !!clientError}
          onClick={() => void submit()}
        >
          {isCreating
            ? "Creating..."
            : clientLoading
              ? "Waiting for network..."
              : clientError || !client
                ? "Network connection required"
                : "Create shared wallet"}
        </Button>
        <Link to="/wallets">
          <Button
            variant="outline"
            className="rounded-full border-zinc-200 bg-white px-5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}

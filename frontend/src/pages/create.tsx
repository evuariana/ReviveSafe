import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { isAddress, type Address } from "viem";

import { AmountInput } from "@/components/inputs/amount-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { useReviveFactory } from "@/hooks/useReviveFactory";

export default function Create() {
  const navigate = useNavigate();
  const { mappedAccount } = useMappedAccount();
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

    if (!requiredNumber || requiredNumber > validOwners.length) {
      setSubmitError("Threshold must be between 1 and the owner count.");
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
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Create multisig
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          Build a mapped-owner ReviveSafe wallet
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          Owners are stored as H160 contract identities, not raw SS58 strings.
          That keeps the contract layer aligned with your mapped Revive runtime
          account model.
        </p>
      </div>

      {!isFactoryAvailable && (
        <Card className="rounded-[24px] border-amber-200 bg-amber-50 shadow-none">
          <CardContent className="p-5 text-sm text-amber-900">
            No factory is active yet. Deploy one from the deploy console or set a
            factory address there before creating a wallet.
            <div className="mt-3">
              <Link to="/deploy">
                <Button variant="outline" className="rounded-xl border-amber-300">
                  Open deploy console
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-[24px] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Owners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {owners.map((owner, index) => (
            <div
              key={`${owner ?? "empty"}-${index}`}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-900">
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
                label="Mapped owner address"
                value={owner}
                onChange={(nextOwner) =>
                  setOwners((currentOwners) =>
                    currentOwners.map((currentOwner, currentIndex) =>
                      currentIndex === index ? nextOwner : currentOwner
                    )
                  )
                }
                description="RelayCode account-input pattern adapted to output H160 values only."
              />
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={() => setOwners((currentOwners) => [...currentOwners, undefined])}
          >
            <Plus className="h-4 w-4" />
            Add owner
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-[24px] border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Threshold</CardTitle>
        </CardHeader>
        <CardContent>
          <AmountInput
            label="Required confirmations"
            value={required}
            onChange={(value) => setRequired(value ?? "1")}
            description={`Choose how many approvals are needed out of ${Math.max(
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

      <div className="flex flex-wrap gap-3">
        <Button className="rounded-xl px-5" disabled={isCreating} onClick={() => void submit()}>
          {isCreating ? "Creating..." : "Create multisig"}
        </Button>
        <Link to="/wallets">
          <Button variant="outline" className="rounded-xl px-5">
            Cancel
          </Button>
        </Link>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { isAddress, type Address } from "viem";

import { AmountInput } from "@/components/inputs/amount-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import {
  WorkspaceBadge,
  WorkspaceHero,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceOutlineButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { MappingGate } from "@/components/wallet/mapping-gate";
import { Button } from "@/components/ui/button";
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
    <MappingGate>
      <div className="mx-auto max-w-5xl space-y-8">
        <WorkspaceHero
          eyebrow="Create wallet"
          title="Set up a programmable shared wallet"
          description="Create a new contract wallet for your team, choose who can approve actions, and set the threshold required before execution."
          aside={
            <div className="space-y-4">
              <WorkspaceBadge>Programmable wallet</WorkspaceBadge>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                This flow creates a new ReviveSafe contract wallet, so it still
                depends on a valid mapping and an active factory.
              </p>
            </div>
          }
        />

        <PublicBetaNotice compact />

        {!isFactoryAvailable ? (
          <WorkspaceNotice tone="amber">
            A wallet factory is not connected yet. Open contract tools to deploy
            one or connect an existing factory before creating a wallet.
            <div className="mt-3">
              <Link to="/deploy">
                <Button variant="outline" className={workspaceOutlineButtonClassName}>
                  Open contract tools
                </Button>
              </Link>
            </div>
          </WorkspaceNotice>
        ) : null}

        <WorkspacePanel title="1. Add owners" contentClassName="space-y-4">
          {mappedAccount?.mappedH160 ? (
            <WorkspaceNotice>
              Your connected account is added as the first owner by default using
              its mapped H160. You can paste either mapped H160 addresses or regular
              SS58 addresses for the other owners.
            </WorkspaceNotice>
          ) : null}

          {owners.map((owner, index) => (
            <div
              key={`${owner ?? "empty"}-${index}`}
              className={`${workspacePanelMutedClassName} p-4`}
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                  Owner #{index + 1}
                </div>
                {owners.length > 1 ? (
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
                ) : null}
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
            className={workspaceOutlineButtonClassName}
            onClick={() => setOwners((currentOwners) => [...currentOwners, undefined])}
          >
            <Plus className="h-4 w-4" />
            Add owner
          </Button>
        </WorkspacePanel>

        <WorkspacePanel title="2. Choose the approval rule">
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
        </WorkspacePanel>

        {submitError || error ? (
          <WorkspaceNotice tone="rose">{submitError || error}</WorkspaceNotice>
        ) : null}
        {clientError ? (
          <WorkspaceNotice tone="amber">
            Contract writes are unavailable until ReviveSafe reconnects to the
            active network runtime.
          </WorkspaceNotice>
        ) : null}

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
              className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
            >
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    </MappingGate>
  );
}

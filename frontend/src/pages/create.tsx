import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { isAddress, type Address } from "viem";

import { AmountInput } from "@/components/inputs/amount-input";
import { MappedAccountInput } from "@/components/inputs/mapped-account-input";
import {
  WorkspaceBadge,
  WorkspaceHero,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceOutlineButtonClassName,
  workspacePageFrameClassName,
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
        "The selected network is not ready for contract wallet actions yet. Reconnect and try again."
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
          : "Failed to create contract wallet"
      );
    }
  };

  return (
    <MappingGate>
      <div className={workspacePageFrameClassName}>
        <WorkspaceHero
          eyebrow="Create wallet"
          title="Create a contract wallet for your team"
          description="Create a shared contract wallet, choose who can approve actions, and set how many approvals are needed before anything executes."
          aside={
            <div className="space-y-4">
              <WorkspaceBadge>Contract wallet</WorkspaceBadge>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                This creates a new shared contract wallet. You need the one-time
                contract-wallet setup step on this account and an active factory.
              </p>
            </div>
          }
        />

        {!isFactoryAvailable ? (
          <WorkspaceNotice tone="amber">
            No contract wallet factory is connected yet. Open contract tools to
            deploy one or connect an existing factory before creating a wallet.
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
              Your connected wallet is added as the first owner by default. You
              can add more owners with either a contract wallet address or a
              regular Polkadot address.
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
                label="Owner"
                value={owner}
                onChange={(nextOwner) =>
                  setOwners((currentOwners) =>
                    currentOwners.map((currentOwner, currentIndex) =>
                      currentIndex === index ? nextOwner : currentOwner
                    )
                  )
                }
                description="Choose a connected wallet or paste the address that should be allowed to approve."
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
            description={`Choose how many approvals are needed out of ${Math.max(
              validOwners.length,
              1
            )} owners.`}
            min={1}
            max={Math.max(validOwners.length, 1)}
          />
        </WorkspacePanel>

        {submitError || error ? (
          <WorkspaceNotice tone="rose">{submitError || error}</WorkspaceNotice>
        ) : null}
        {clientError ? (
          <WorkspaceNotice tone="amber">
            Contract wallet actions are unavailable until ReviveSafe reconnects
            to the selected network.
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
                  : "Create contract wallet"}
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

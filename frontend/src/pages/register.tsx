import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { isAddress, type Address } from "viem";

import { reviveWalletAbi } from "@/config/contracts";
import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import {
  WorkspaceBadge,
  WorkspaceHero,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceInputClassName,
  workspaceOutlineButtonClassName,
  workspacePageCompactClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { MappingGate } from "@/components/wallet/mapping-gate";
import { Button } from "@/components/ui/button";
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
          : "Failed to add contract wallet"
      );
    }
  };

  return (
    <MappingGate>
      <div className={workspacePageCompactClassName}>
        <WorkspaceHero
          eyebrow="Add contract wallet"
          title="Add an existing contract wallet to this workspace"
          description="Register an already deployed contract wallet so your team can review balances, approvals, and proposal history from the same app."
          aside={
            <div className="space-y-4">
              <WorkspaceBadge>Compatible contract wallet</WorkspaceBadge>
              <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                This does not redeploy or change the wallet. It only adds a
                compatible ReviveSafe contract wallet into the workspace.
              </p>
            </div>
          }
        />

        <PublicBetaNotice compact />

        <WorkspacePanel title="Wallet address" contentClassName="space-y-4">
          {!isFactoryAvailable ? (
            <WorkspaceNotice tone="amber">
              No active factory is configured yet. Add one before you register a
              wallet in this workspace.
              <div className="mt-3">
                <Link to="/deploy">
                  <Button variant="outline" className={workspaceOutlineButtonClassName}>
                    Open contract tools
                  </Button>
                </Link>
              </div>
            </WorkspaceNotice>
          ) : null}

          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">Wallet contract address</Label>
            <Input
              className={`${workspaceInputClassName} font-mono`}
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

          {normalizedAddress ? (
            <div className={`${workspacePanelMutedClassName} p-4 text-sm text-zinc-700 dark:text-zinc-300`}>
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
          ) : null}

          {submitError || error ? (
            <WorkspaceNotice tone="rose">{submitError || error}</WorkspaceNotice>
          ) : null}
          {clientError ? (
            <WorkspaceNotice tone="amber">
              Contract writes are unavailable until ReviveSafe reconnects to the
              active network runtime.
            </WorkspaceNotice>
          ) : null}

          {registerSuccess ? (
            <WorkspaceNotice tone="emerald">
              Contract wallet added. You can now open it from the wallets page
              with this owner account.
            </WorkspaceNotice>
          ) : null}

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
        </WorkspacePanel>
      </div>
    </MappingGate>
  );
}

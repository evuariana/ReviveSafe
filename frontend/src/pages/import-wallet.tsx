import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "@luno-kit/react";
import { Plus, Trash2 } from "lucide-react";

import { AmountInput } from "@/components/inputs/amount-input";
import { PublicBetaNotice } from "@/components/layout/public-beta-notice";
import {
  WorkspaceBadge,
  WorkspaceHero,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceInputClassName,
  workspaceOutlineButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  buildImportedNativeWallet,
  useNativeMultisigOperations,
} from "@/hooks/useNativeMultisig";
import { useWorkspaceNativeWallets } from "@/hooks/useWorkspaceNativeWallets";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { addressEquals } from "@/lib/native-multisig";

export default function ImportWallet() {
  const navigate = useNavigate();
  const { account } = useAccount();
  const { chain, client } = usePolkadotClient();
  const upsertWallet = useWorkspaceNativeWallets((state) => state.upsertWallet);
  const [label, setLabel] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [optionalAddress, setOptionalAddress] = useState("");
  const [threshold, setThreshold] = useState("1");
  const [submitError, setSubmitError] = useState<string>();

  useEffect(() => {
    if (account?.address && members.length === 0) {
      setMembers([account.address]);
    }
  }, [account?.address, members.length]);

  const previewWallet = useMemo(() => {
    try {
      if (members.filter((member) => member.trim()).length === 0) {
        return null;
      }

      return buildImportedNativeWallet({
        address: optionalAddress.trim() || undefined,
        chainKey: chain.key,
        members: members.filter((member) => member.trim()),
        name: label,
        ss58Prefix: Number(client?.consts.system.ss58Prefix.toString() ?? 0),
        threshold: Number(threshold || 0),
      });
    } catch {
      return null;
    }
  }, [chain.key, client, label, members, optionalAddress, threshold]);

  const previewOperationsQuery = useNativeMultisigOperations(
    previewWallet ? [previewWallet] : [],
    {
      refetchInterval: false,
    }
  );

  const validMembers = members.filter((member) => member.trim());
  const connectedMember = account?.address
    ? validMembers.some((member) => addressEquals(member, account.address))
    : false;

  const submit = () => {
    try {
      setSubmitError(undefined);

      const wallet = buildImportedNativeWallet({
        address: optionalAddress.trim() || undefined,
        chainKey: chain.key,
        members: validMembers,
        name: label,
        ss58Prefix: Number(client?.consts.system.ss58Prefix.toString() ?? 0),
        threshold: Number(threshold || 0),
      });

      if (!connectedMember) {
        throw new Error(
          "Use a connected account that is one of the direct multisig members."
        );
      }

      upsertWallet(wallet);
      navigate(`/wallet/${wallet.address}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to import native wallet."
      );
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <WorkspaceHero
        eyebrow="Import wallet"
        title="Import a native multisig wallet"
        description="Import is manual and verified. Enter the direct member set and threshold, and ReviveSafe will derive the deterministic native multisig account for this chain before it adds anything to your browser-local workspace on this device."
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone="sky">Manual verified import</WorkspaceBadge>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              This flow supports direct `pallet_multisig` wallets. Proxy wrappers
              and automatic wallet discovery are intentionally out of scope here.
            </p>
          </div>
        }
      />

      <PublicBetaNotice compact />

      <WorkspacePanel title="1. Add direct members" contentClassName="space-y-4">
        <WorkspaceNotice>
          Native import currently supports direct `pallet_multisig` wallets. Proxy
          wrappers and automatic wallet discovery are not part of this pass.
        </WorkspaceNotice>
        <WorkspaceNotice tone="amber">
          Imported native wallets are currently stored in this browser only. If
          you switch browsers or devices, you will need to import them again.
        </WorkspaceNotice>

        {members.map((member, index) => (
          <div
            key={`${member}-${index}`}
            className={`${workspacePanelMutedClassName} p-4`}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                Member #{index + 1}
              </div>
              {members.length > 1 ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setMembers((current) =>
                      current.filter((_, currentIndex) => currentIndex !== index)
                    )
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            <Input
              className={workspaceInputClassName}
              placeholder="1..."
              value={member}
              onChange={(event) =>
                setMembers((current) =>
                  current.map((entry, currentIndex) =>
                    currentIndex === index ? event.target.value : entry
                  )
                )
              }
            />
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          className={workspaceOutlineButtonClassName}
          onClick={() => setMembers((current) => [...current, ""])}
        >
          <Plus className="h-4 w-4" />
          Add member
        </Button>
      </WorkspacePanel>

      <div className="grid gap-6 lg:grid-cols-2">
        <WorkspacePanel title="2. Review derived wallet" contentClassName="space-y-4">
          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">Wallet label</Label>
            <Input
              className={workspaceInputClassName}
              placeholder="Treasury wallet"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            />
          </div>

          <AmountInput
            label="Required approvals"
            value={threshold}
            onChange={(value) => setThreshold(value ?? "1")}
            min={1}
            max={Math.max(validMembers.length, 1)}
            description="Use the exact threshold that created the original native multisig."
          />

          <div className="space-y-2">
            <Label className="text-zinc-700 dark:text-zinc-300">
              Optional wallet address
            </Label>
            <Input
              className={workspaceInputClassName}
              placeholder="1..."
              value={optionalAddress}
              onChange={(event) => setOptionalAddress(event.target.value)}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Leave blank to let ReviveSafe derive the wallet address. If you
              provide an address, it must match the entered members and threshold.
            </p>
          </div>

          {previewWallet ? (
            <div className={`${workspacePanelMutedClassName} p-4 text-sm text-zinc-700 dark:text-zinc-300`}>
              <div className="font-semibold text-zinc-950 dark:text-white">
                Derived wallet
              </div>
              <div className="mt-2 break-all font-mono text-xs">
                {previewWallet.address}
              </div>
              <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
                {previewWallet.threshold} of {previewWallet.members.length} approvals
              </div>
            </div>
          ) : (
            <WorkspaceNotice tone="amber">
              Enter a valid member set and threshold to derive the wallet.
            </WorkspaceNotice>
          )}
        </WorkspacePanel>

        <WorkspacePanel title="3. Preview recovered details" contentClassName="space-y-4">
          <div className={`${workspacePanelMutedClassName} p-4 text-sm text-zinc-700 dark:text-zinc-300`}>
            <div className="font-semibold text-zinc-950 dark:text-white">
              Connected account
            </div>
            <div className="mt-2 break-all font-mono text-xs">
              {account?.address ?? "Connect a wallet first"}
            </div>
            <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
              {connectedMember
                ? "This account is one of the entered direct members."
                : "Only direct multisig members can import and act on this wallet right now."}
            </div>
          </div>

          {previewWallet ? (
            <div className={`${workspacePanelMutedClassName} p-4 text-sm text-zinc-700 dark:text-zinc-300`}>
              <div className="font-semibold text-zinc-950 dark:text-white">
                Pending proposals
              </div>
              <div className="mt-2 text-2xl font-semibold text-zinc-950 dark:text-white">
                {previewOperationsQuery.isLoading
                  ? "..."
                  : previewOperationsQuery.data?.length ?? 0}
              </div>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                ReviveSafe will recover pending native proposals where chain data
                is available. Some imported items may still expose only a call hash.
              </p>
            </div>
          ) : null}

          {submitError ? <WorkspaceNotice tone="rose">{submitError}</WorkspaceNotice> : null}
        </WorkspacePanel>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          className="rounded-full px-5"
          disabled={!previewWallet || !connectedMember}
          onClick={submit}
        >
          Import wallet
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
  );
}

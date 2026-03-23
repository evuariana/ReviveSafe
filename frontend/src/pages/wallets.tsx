import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Shield, Sparkles, Waypoints } from "lucide-react";
import { type Address } from "viem";

import {
  WorkspaceBadge,
  WorkspaceEmptyState,
  WorkspaceHero,
  WorkspaceLinkCard,
  WorkspaceNotice,
  WorkspacePanel,
  workspaceInputClassName,
  workspaceOutlineButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChainToken } from "@/hooks/useChainToken";
import {
  useImportedNativeWallets,
  useNativeMultisigWallet,
} from "@/hooks/useNativeMultisig";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatTokenBalance } from "@/lib/currency";
import { formatAddress } from "@/lib/utils";
import type { ImportedNativeWalletRecord } from "@/types/revive";

function matchesSearch(searchTerm: string, ...values: Array<string | undefined>) {
  const normalized = searchTerm.trim().toLowerCase();

  if (!normalized) {
    return true;
  }

  return values.some((value) => value?.toLowerCase().includes(normalized));
}

function WalletMetaStat({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className={`${workspacePanelMutedClassName} p-3`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
        {label}
      </div>
      <div className="mt-2 text-lg font-semibold text-zinc-950 dark:text-white">
        {value}
      </div>
    </div>
  );
}

function ProgrammableWalletCard({ address }: { address: Address }) {
  const token = useChainToken();
  const wallet = useReviveWallet(address);

  return (
    <WorkspaceLinkCard
      to={`/wallet/${address}`}
      title={formatAddress(address, 6)}
      meta="Programmable contract wallet"
      description="Contract wallet with programmable approvals and execution on Asset Hub."
      badge={<WorkspaceBadge>Programmable</WorkspaceBadge>}
      note={
        <div className="grid gap-3 sm:grid-cols-2">
          <WalletMetaStat
            label="Balance"
            value={`${formatTokenBalance(wallet.balance ?? 0n, token.decimals)} ${token.symbol}`}
          />
          <WalletMetaStat
            label="Approval rule"
            value={`${wallet.required ?? "..."} of ${wallet.owners?.length ?? "..."}`}
          />
          <WalletMetaStat
            label="Pending proposals"
            value={wallet.pendingCount.toString()}
          />
        </div>
      }
    />
  );
}

function NativeWalletCard({ wallet }: { wallet: ImportedNativeWalletRecord }) {
  const token = useChainToken();
  const nativeWallet = useNativeMultisigWallet(wallet);

  return (
    <WorkspaceLinkCard
      to={`/wallet/${wallet.address}`}
      title={wallet.name || formatAddress(wallet.address, 6)}
      meta="Imported native multisig"
      description="Reconstructed from the exact direct member set and threshold for this chain."
      badge={<WorkspaceBadge tone="sky">Native</WorkspaceBadge>}
      note={
        <div className="grid gap-3 sm:grid-cols-2">
          <WalletMetaStat
            label="Balance"
            value={
              nativeWallet.balance === undefined
                ? "Loading..."
                : `${formatTokenBalance(nativeWallet.balance, token.decimals)} ${token.symbol}`
            }
          />
          <WalletMetaStat
            label="Approval rule"
            value={`${wallet.threshold} of ${wallet.members.length}`}
          />
          <WalletMetaStat
            label="Pending proposals"
            value={nativeWallet.operations.length.toString()}
          />
        </div>
      }
    />
  );
}

export default function Wallets() {
  const { myMultisigs, myMultisigsQuery } = useReviveFactory();
  const importedNativeWallets = useImportedNativeWallets();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProgrammableWallets = useMemo(
    () =>
      myMultisigs.filter((multisigAddress) =>
        matchesSearch(searchTerm, multisigAddress)
      ),
    [myMultisigs, searchTerm]
  );
  const filteredNativeWallets = useMemo(
    () =>
      importedNativeWallets.filter((wallet) =>
        matchesSearch(searchTerm, wallet.name, wallet.address)
      ),
    [importedNativeWallets, searchTerm]
  );

  const hasWallets = myMultisigs.length > 0 || importedNativeWallets.length > 0;
  const hasMatches =
    filteredProgrammableWallets.length > 0 || filteredNativeWallets.length > 0;

  return (
    <div className="space-y-8">
      <WorkspaceHero
        eyebrow="Wallets"
        title="Shared wallets in this workspace"
        description="Browse imported native multisigs and programmable contract wallets from one list. Open any wallet to review balances, members, proposals, and activity."
        actions={
          <>
            <Link to="/import">
              <Button className="rounded-full px-5">Import native wallet</Button>
            </Link>
            <Link to="/create">
              <Button
                variant="outline"
                className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
              >
                Create programmable wallet
              </Button>
            </Link>
          </>
        }
        aside={
          <div className="space-y-4">
            <WorkspaceBadge tone="sky">Cross-wallet directory</WorkspaceBadge>
            <p className="text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Native and programmable wallets live together here, but imported
              native wallets still keep their more limited capability model and
              are currently stored only in this browser on this device.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <WalletMetaStat
                label="Total wallets"
                value={(myMultisigs.length + importedNativeWallets.length).toString()}
              />
              <WalletMetaStat
                label="Native imports"
                value={importedNativeWallets.length.toString()}
              />
              <WalletMetaStat
                label="Programmable"
                value={myMultisigsQuery.isLoading ? "..." : myMultisigs.length.toString()}
              />
            </div>
          </div>
        }
      />

      <WorkspacePanel
        title="Wallet directory"
        description="Search by label or wallet address, then jump straight into the wallet surface that matters."
        contentClassName="space-y-8"
      >
        <WorkspaceNotice tone="amber">
          Imported native wallets are currently browser-local workspace entries.
          Re-import them on any other browser or device.
        </WorkspaceNotice>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
          <div className="relative max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <Input
              className={`${workspaceInputClassName} pl-11`}
              placeholder="Search by label or wallet address"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Link to="/register">
              <Button
                variant="outline"
                className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
              >
                Add contract wallet
              </Button>
            </Link>
          </div>
        </div>

        {!hasWallets ? (
          <WorkspaceEmptyState
            icon={Shield}
            title="No wallets yet"
            description="Import a native multisig, create a programmable contract wallet, or add an existing compatible contract wallet to start managing it here."
            action={
              <>
                <Link to="/import">
                  <Button className="rounded-full px-5">Import wallet</Button>
                </Link>
                <Link to="/create">
                  <Button
                    variant="outline"
                    className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
                  >
                    Create wallet
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="outline"
                    className={`rounded-full px-5 ${workspaceOutlineButtonClassName}`}
                  >
                    Add contract wallet
                  </Button>
                </Link>
              </>
            }
          />
        ) : !hasMatches ? (
          <WorkspaceNotice>No wallets match this search yet.</WorkspaceNotice>
        ) : (
          <div className="space-y-8">
            {filteredNativeWallets.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <Waypoints className="h-4 w-4" />
                  Imported native wallets
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredNativeWallets.map((wallet) => (
                    <NativeWalletCard key={wallet.accountIdHex} wallet={wallet} />
                  ))}
                </div>
              </section>
            )}

            {myMultisigsQuery.error && (
              <WorkspaceNotice tone="rose">
                {(myMultisigsQuery.error as Error).message}
              </WorkspaceNotice>
            )}

            {myMultisigsQuery.isLoading && filteredNativeWallets.length === 0 ? (
              <WorkspaceNotice>
                Loading programmable wallets from the active factory...
              </WorkspaceNotice>
            ) : filteredProgrammableWallets.length > 0 ? (
              <section className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  <Sparkles className="h-4 w-4" />
                  Programmable wallets
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                  {filteredProgrammableWallets.map((multisigAddress) => (
                    <ProgrammableWalletCard
                      key={multisigAddress}
                      address={multisigAddress}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </WorkspacePanel>
    </div>
  );
}

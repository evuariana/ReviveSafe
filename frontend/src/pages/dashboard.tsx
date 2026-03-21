import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@luno-kit/react";
import {
  ArrowRight,
  Blocks,
  CheckCircle2,
  Clock3,
  Coins,
  ShieldCheck,
  Waypoints,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChainToken } from "@/hooks/useChainToken";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import {
  type WorkspaceProposalItem,
  useWorkspaceQueues,
} from "@/hooks/useWorkspaceQueues";
import { formatTokenBalance } from "@/lib/currency";
import { decodeAssetTransferCall, findHubAssetById } from "@/lib/precompiles";
import { formatAddress } from "@/lib/utils";
import type { ChainTokenInfo, HubAsset } from "@/types/revive";

function describeTransaction(
  proposal: WorkspaceProposalItem,
  assets: HubAsset[],
  token: ChainTokenInfo
) {
  const decodedAssetTransfer = decodeAssetTransferCall(
    proposal.transaction.destination,
    proposal.transaction.data
  );

  if (decodedAssetTransfer) {
    const asset = findHubAssetById(assets, decodedAssetTransfer.assetId);
    const assetSymbol = asset?.symbol || `#${decodedAssetTransfer.assetId}`;

    return `Transfer ${formatTokenBalance(
      decodedAssetTransfer.amount,
      asset?.decimals ?? 0
    )} ${assetSymbol} to ${formatAddress(decodedAssetTransfer.recipient, 6)}`;
  }

  if (proposal.transaction.data !== "0x") {
    if (proposal.transaction.value > 0n) {
      return `Send ${formatTokenBalance(
        proposal.transaction.value,
        token.decimals
      )} ${token.symbol} and execute calldata`;
    }

    return `Contract call to ${formatAddress(proposal.transaction.destination, 6)}`;
  }

  return `Send ${formatTokenBalance(
    proposal.transaction.value,
    token.decimals
  )} ${token.symbol} to ${formatAddress(proposal.transaction.destination, 6)}`;
}

function ProposalQueueSection({
  title,
  items,
  emptyMessage,
  loading,
  error,
  assets,
  token,
}: {
  title: string;
  items: WorkspaceProposalItem[];
  emptyMessage: string;
  loading: boolean;
  error?: string;
  assets: HubAsset[];
  token: ChainTokenInfo;
}) {
  return (
    <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      <CardHeader>
        <CardTitle className="text-lg text-zinc-950 dark:text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
            Loading live proposal data...
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
            {emptyMessage}
          </div>
        ) : (
          items.slice(0, 4).map((proposal) => (
            <Link
              key={`${proposal.walletAddress}-${proposal.transaction.id}`}
              to={`/wallet/${proposal.walletAddress}`}
              className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                    Proposal #{proposal.transaction.id}
                  </div>
                  <div className="mt-1 text-xs font-mono text-zinc-500">
                    Wallet {formatAddress(proposal.walletAddress, 6)}
                  </div>
                  <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {describeTransaction(proposal, assets, token)}
                  </div>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  <div className="font-semibold text-zinc-950 dark:text-white">
                    {proposal.transaction.confirmations.length}/{proposal.required}
                  </div>
                  <div>approvals</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { account } = useAccount();
  const token = useChainToken();
  const { client, chain } = usePolkadotClient();
  const { mappedAccount } = useMappedAccount();
  const { myMultisigs, myMultisigsQuery, factoryAddress } = useReviveFactory();
  const defaultFactoryAddress = useFactoryAddress(
    (state) => state.defaultFactoryAddress
  );
  const assetsQuery = useHubAssets();
  const assets = assetsQuery.data ?? [];
  const workspaceQueues = useWorkspaceQueues(myMultisigs, mappedAccount?.mappedH160);

  const accountBalanceQuery = useQuery({
    queryKey: ["connected-account-balance", account?.address],
    enabled: !!account?.address && !!client,
    queryFn: async () => {
      const response = await client?.query.system.account(account?.address ?? "");
      return response ? BigInt(response.data.free.toString()) : 0n;
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.26em] text-zinc-500">
          Overview
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          Wallet workspace overview
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Check whether this account is ready, how many wallets are connected,
          which factory is active, and which assets are already loaded from
          Asset Hub.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader className="border-b border-zinc-200 pb-5 dark:border-white/8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-2xl font-semibold text-zinc-950 dark:text-white">
                  Workspace status
                </CardTitle>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                  The essentials for creating wallets, opening approvals, and
                  moving assets from this account.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
              >
                <Link to="/create">
                  Create wallet
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4 pt-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Account
                </div>
                <Waypoints className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">
                {mappedAccount?.isMapped ? "Active" : "Needs setup"}
              </div>
              <div className="mt-2 break-all font-mono text-xs text-zinc-500">
                {mappedAccount?.mappedH160 ?? "Connect a wallet"}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Factory
                </div>
                <Blocks className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="mt-3 text-lg font-semibold text-zinc-950 dark:text-white">
                {factoryAddress ? "Configured" : "Missing"}
              </div>
              <div className="mt-2 break-all font-mono text-xs text-zinc-500">
                {factoryAddress ?? defaultFactoryAddress ?? "Deploy or set a factory"}
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Wallets
                </div>
                <ShieldCheck className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="mt-3 text-3xl font-semibold text-zinc-950 dark:text-white">
                {myMultisigsQuery.isLoading ? "..." : myMultisigs.length}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Wallets this account can access right now.
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Balance
                </div>
                <Coins className="h-4 w-4 text-zinc-400" />
              </div>
              <div className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
                {accountBalanceQuery.isLoading
                  ? "Loading..."
                  : `${formatTokenBalance(accountBalanceQuery.data ?? 0n, token.decimals)} ${token.symbol}`}
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                Native runtime balance on {chain.name}.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="text-lg text-zinc-950 dark:text-white">
              Asset coverage
            </CardTitle>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Assets loaded from Asset Hub for balance checks and token proposal
              flows.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {assetsQuery.error ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                Asset metadata could not be loaded from the active network.
              </div>
            ) : assetsQuery.isLoading ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                Asset metadata is still loading from the network.
              </div>
            ) : assets.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                No Asset Hub metadata is available on the active network yet.
              </div>
            ) : (
              assets.slice(0, 5).map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-zinc-950 dark:text-white">
                        {asset.symbol || asset.name}
                      </div>
                      <div className="mt-1 text-xs text-zinc-500">
                        {asset.name} • #{asset.id}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">
                      {asset.precompileAddress}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ProposalQueueSection
          title="Needs your approval"
          items={workspaceQueues.needsApproval}
          emptyMessage="Nothing is waiting on this account right now."
          loading={myMultisigsQuery.isLoading || workspaceQueues.isLoading}
          error={
            (myMultisigsQuery.error instanceof Error && myMultisigsQuery.error.message) ||
            workspaceQueues.error
          }
          assets={assets}
          token={token}
        />
        <ProposalQueueSection
          title="Ready to execute"
          items={workspaceQueues.readyToExecute}
          emptyMessage="No approved proposals are ready for this account to execute."
          loading={myMultisigsQuery.isLoading || workspaceQueues.isLoading}
          error={
            (myMultisigsQuery.error instanceof Error && myMultisigsQuery.error.message) ||
            workspaceQueues.error
          }
          assets={assets}
          token={token}
        />
        <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-zinc-950 dark:text-white">
              <CheckCircle2 className="h-5 w-5" />
              Executed proposals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {((myMultisigsQuery.error instanceof Error &&
              myMultisigsQuery.error.message) ||
              workspaceQueues.error) ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {(myMultisigsQuery.error instanceof Error &&
                  myMultisigsQuery.error.message) ||
                  workspaceQueues.error}
              </div>
            ) : workspaceQueues.isLoading && workspaceQueues.recentActivity.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                Loading executed proposals...
              </div>
            ) : workspaceQueues.recentActivity.length === 0 ? (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
                No executed proposals have been detected across your wallets yet.
              </div>
            ) : (
              workspaceQueues.recentActivity.map((entry) => (
                <Link
                  key={`activity-${entry.walletAddress}-${entry.transaction.id}`}
                  to={`/wallet/${entry.walletAddress}`}
                  className="block rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-zinc-950 dark:text-white">
                        <Clock3 className="h-4 w-4" />
                        Proposal #{entry.transaction.id} executed
                      </div>
                      <div className="mt-1 text-xs font-mono text-zinc-500">
                        Wallet {formatAddress(entry.walletAddress, 6)}
                      </div>
                      <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        {describeTransaction(
                          {
                            walletAddress: entry.walletAddress,
                            owners: [],
                            required: entry.transaction.confirmations.length,
                            transaction: entry.transaction,
                            needsApproval: false,
                            readyToExecute: false,
                          },
                          assets,
                          token
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
        <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-200 pb-5 dark:border-white/8">
          <div>
            <CardTitle className="text-xl text-zinc-950 dark:text-white">
              Team wallets
            </CardTitle>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Open a wallet to review owners, balances, and the proposal queue.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <Link to="/wallets">View all wallets</Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-2">
          {myMultisigsQuery.error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700 md:col-span-2">
              {(myMultisigsQuery.error as Error).message}
            </div>
          ) : myMultisigsQuery.isLoading ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400 md:col-span-2">
              Loading wallets from the active factory...
            </div>
          ) : myMultisigs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/12 dark:bg-white/[0.03] dark:text-zinc-400 md:col-span-2">
              No wallets yet. Create one or add an existing contract wallet to
              start working from this workspace.
            </div>
          ) : (
            myMultisigs.slice(0, 4).map((multisigAddress) => (
              <Link
                key={multisigAddress}
                to={`/wallet/${multisigAddress}`}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition-colors hover:bg-zinc-100 dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.05]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-mono text-sm text-zinc-950 dark:text-white">
                      {multisigAddress}
                    </div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                      Shared wallet
                    </div>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                    Open
                  </div>
                </div>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

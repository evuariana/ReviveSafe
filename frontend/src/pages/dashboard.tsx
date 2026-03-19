import { useQuery } from "@tanstack/react-query";
import { useAccount } from "@luno-kit/react";
import { Blocks, Coins, ShieldCheck, Waypoints } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChainToken } from "@/hooks/useChainToken";
import { useFactoryAddress } from "@/hooks/useFactoryAddress";
import { useHubAssets } from "@/hooks/useHubAssets";
import { useMappedAccount } from "@/hooks/useMappedAccount";
import { usePolkadotClient } from "@/hooks/usePolkadotClient";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { formatTokenBalance } from "@/lib/currency";

export default function Dashboard() {
  const { account } = useAccount();
  const token = useChainToken();
  const { client, chain } = usePolkadotClient();
  const { mappedAccount } = useMappedAccount();
  const { myMultisigs, factoryAddress } = useReviveFactory();
  const defaultFactoryAddress = useFactoryAddress(
    (state) => state.defaultFactoryAddress
  );
  const { data: assets = [] } = useHubAssets();

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
            Overview
          </div>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
            Dedot-native multisig operations
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
            This dashboard now reflects the rewrite: a mapped H160 identity,
            LunoKit connection flow, and Revive writes for both multisig actions
            and deploy tooling.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Mapped identity</CardTitle>
            <Waypoints className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-slate-950">
              {mappedAccount?.isMapped ? "Ready" : "Pending"}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-slate-500">
              {mappedAccount?.mappedH160 ?? "Connect a wallet"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Factory</CardTitle>
            <Blocks className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-semibold text-slate-950">
              {factoryAddress ? "Configured" : "Missing"}
            </div>
            <p className="mt-2 break-all font-mono text-xs text-slate-500">
              {factoryAddress ?? defaultFactoryAddress ?? "Deploy or set a factory"}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">My multisigs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-950">
              {myMultisigs.length}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Factory reads now use the mapped H160 owner address.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected balance</CardTitle>
            <Coins className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-slate-950">
              {formatTokenBalance(accountBalanceQuery.data ?? 0n, token.decimals)}{" "}
              {token.symbol}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Native balance from runtime storage on {chain.name}.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>My registered multisigs</CardTitle>
              <p className="mt-1 text-sm text-slate-500">
                ReviveSafe now resolves these from the factory with your mapped
                H160 identity.
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link to="/create">Create new</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {myMultisigs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                No multisigs registered yet. Deploy or set a factory, then
                create your first wallet from the create flow.
              </div>
            ) : (
              myMultisigs.slice(0, 5).map((multisigAddress) => (
                <Link
                  key={multisigAddress}
                  to={`/wallet/${multisigAddress}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                >
                  <div>
                    <div className="font-mono text-sm text-slate-900">
                      {multisigAddress}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      Revive multisig contract
                    </div>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Open
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[24px] border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Precompile surface</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              The app bootstraps asset metadata through Dedot and uses those IDs
              to target deterministic ERC-20 style precompiles.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {assets.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                Asset metadata is still loading from the chain.
              </div>
            ) : (
              assets.slice(0, 6).map((asset) => (
                <div
                  key={asset.id}
                  className="rounded-2xl border border-slate-200 p-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {asset.symbol || asset.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        {asset.name} • #{asset.id}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] text-slate-500">
                      {asset.precompileAddress}
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

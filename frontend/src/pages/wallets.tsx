import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Shield } from "lucide-react";
import { type Address } from "viem";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useChainToken } from "@/hooks/useChainToken";
import { useReviveFactory } from "@/hooks/useReviveFactory";
import { useReviveWallet } from "@/hooks/useReviveWallet";
import { formatTokenBalance } from "@/lib/currency";
import { formatAddress } from "@/lib/utils";

function MultisigCard({ address }: { address: Address }) {
  const token = useChainToken();
  const wallet = useReviveWallet(address);

  return (
    <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      <CardHeader>
        <CardTitle className="text-lg text-zinc-950 dark:text-white">
          {formatAddress(address, 6)}
        </CardTitle>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Shared wallet with approval thresholds and queued actions.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-white/10 dark:bg-white/[0.03]">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Balance
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
              {formatTokenBalance(wallet.balance ?? 0n, token.decimals)}{" "}
              {token.symbol}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
              Threshold
            </div>
            <div className="mt-1 text-lg font-semibold text-zinc-950 dark:text-white">
              {wallet.required ?? "..."} / {wallet.owners?.length ?? "..."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
          <span>Pending proposals</span>
          <span className="font-semibold text-zinc-950 dark:text-white">
            {wallet.pendingCount}
          </span>
        </div>

        <Link to={`/wallet/${address}`}>
          <Button
            className="w-full rounded-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
            variant="outline"
          >
            Open wallet
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function Wallets() {
  const { myMultisigs, myMultisigsQuery } = useReviveFactory();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMultisigs = useMemo(
    () =>
      myMultisigs.filter((multisigAddress) =>
        multisigAddress.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [myMultisigs, searchTerm]
  );

  return (
    <div className="space-y-6">
      <div>
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-zinc-500">
          Wallets
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
          All team wallets
        </h1>
        <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
          Browse every wallet this account can access. Open one to review
          balances, owners, and pending proposals.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
        <Input
          className="h-11 rounded-full border-zinc-200 bg-white pl-10 dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
          placeholder="Search by wallet address"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {myMultisigsQuery.isLoading ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-sm text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
          Loading wallets from the factory...
        </div>
      ) : myMultisigsQuery.error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
          {(myMultisigsQuery.error as Error).message}
        </div>
      ) : filteredMultisigs.length === 0 ? (
        <Card className="rounded-[28px] border-dashed border-zinc-300 bg-white shadow-none dark:border-white/12 dark:bg-[#0a0a0a]">
          <CardContent className="py-12 text-center">
            <Shield className="mx-auto h-14 w-14 text-zinc-300 dark:text-zinc-600" />
            <h2 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
              No wallets yet
            </h2>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Create a new wallet or add an existing contract wallet to start
              managing it here.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/create">
                <Button className="rounded-full px-5">Create wallet</Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  className="rounded-full border-zinc-200 bg-white px-5 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:border-white/10 dark:bg-transparent dark:text-zinc-200 dark:hover:bg-white/[0.06] dark:hover:text-white"
                >
                  Add contract wallet
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredMultisigs.map((multisigAddress) => (
            <MultisigCard key={multisigAddress} address={multisigAddress} />
          ))}
        </div>
      )}
    </div>
  );
}

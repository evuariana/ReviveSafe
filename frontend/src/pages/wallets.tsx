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
    <Card className="rounded-[24px] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{formatAddress(address, 6)}</CardTitle>
        <p className="text-sm text-slate-500">
          Revive multisig contract with native and precompile proposal paths.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Balance
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-950">
              {formatTokenBalance(wallet.balance ?? 0n, token.decimals)}{" "}
              {token.symbol}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Threshold
            </div>
            <div className="mt-1 text-lg font-semibold text-slate-950">
              {wallet.required ?? "..."} / {wallet.owners?.length ?? "..."}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>Pending proposals</span>
          <span className="font-semibold text-slate-950">{wallet.pendingCount}</span>
        </div>

        <Link to={`/wallet/${address}`}>
          <Button className="w-full rounded-xl" variant="outline">
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
        <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Wallets
        </div>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">
          My registered multisigs
        </h1>
        <p className="mt-2 text-sm leading-7 text-slate-600">
          These wallets are pulled from the factory using your mapped H160 owner
          address and then hydrated through read-only ETH-RPC contract calls.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          className="pl-10"
          placeholder="Search by multisig address..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {myMultisigsQuery.isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">
          Loading multisigs from the factory...
        </div>
      ) : filteredMultisigs.length === 0 ? (
        <Card className="rounded-[24px] border-dashed border-slate-300 shadow-none">
          <CardContent className="py-12 text-center">
            <Shield className="mx-auto h-14 w-14 text-slate-300" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">
              No multisigs found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Create or register a wallet to populate this view.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link to="/create">
                <Button className="rounded-xl">Create multisig</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="rounded-xl">
                  Register existing
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

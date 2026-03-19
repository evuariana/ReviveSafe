import type { ReactNode } from "react";
import { Loader2, Shield, Waypoints } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMappedAccount } from "@/hooks/useMappedAccount";

export function MappingGate({ children }: { children: ReactNode }) {
  const { mappedAccount, isLoading, isMapping, mapAccount, mappingError } =
    useMappedAccount();

  if (!mappedAccount) {
    return <>{children}</>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-slate-500" />
      </div>
    );
  }

  if (mappedAccount.isMapped) {
    return <>{children}</>;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Card className="border-slate-200 shadow-xl shadow-slate-200/50">
        <CardHeader className="space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-amber-400 text-white shadow-lg">
            <Waypoints className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Map your contract account</CardTitle>
            <p className="text-sm text-slate-600">
              ReviveSafe now signs through `pallet_revive`, so your connected
              SS58 account needs its mapped H160 before any factory or multisig
              action can run.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Connected SS58
              </div>
              <div className="mt-2 break-all font-mono text-slate-900">
                {mappedAccount.ss58Address}
              </div>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Derived H160
              </div>
              <div className="mt-2 break-all font-mono text-slate-900">
                {mappedAccount.mappedH160}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-center gap-2 font-semibold">
              <Shield className="h-4 w-4" />
              Mapping is required once per account
            </div>
            <p className="mt-2 text-amber-800">
              After this on-chain setup succeeds, ReviveSafe can create
              multisigs, submit proposals, and deploy contracts using the same
              mapped identity everywhere in the app.
            </p>
          </div>

          {mappingError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {mappingError}
            </div>
          )}

          <Button
            className="h-11 rounded-xl px-5"
            onClick={() => void mapAccount()}
            disabled={isMapping}
          >
            {isMapping ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mapping account...
              </>
            ) : (
              "Run map_account"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

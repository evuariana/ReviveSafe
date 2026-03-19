import { Copy, Shield, Users } from "lucide-react";
import { type Address } from "viem";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAddress } from "@/lib/utils";

interface OwnersInfoProps {
  owners?: Address[];
  required?: number;
  userAddress?: Address;
}

export default function OwnersInfo({
  owners,
  required,
  userAddress,
}: OwnersInfoProps) {
  return (
    <Card className="rounded-[24px] border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Users className="h-5 w-5" />
          Owners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
          <div className="flex items-center gap-2 font-semibold text-slate-900">
            <Shield className="h-4 w-4" />
            {required ?? "..."} of {owners?.length ?? "..."} approvals required
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Every owner is stored as a mapped H160 identity, so the contract and
            the Revive runtime agree on who can propose, confirm, and execute.
          </p>
        </div>

        <div className="space-y-3">
          {(owners ?? []).map((owner, index) => {
            const isCurrentOwner = owner.toLowerCase() === userAddress?.toLowerCase();

            return (
              <div
                key={owner}
                className="flex items-center justify-between rounded-2xl border border-slate-200 p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-slate-900">
                      {formatAddress(owner, 6)}
                    </div>
                    {isCurrentOwner && (
                      <div className="mt-1 inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
                        You
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(owner)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

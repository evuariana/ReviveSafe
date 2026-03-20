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
    <Card className="rounded-[28px] border-zinc-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-[#0a0a0a] dark:shadow-[0_0_40px_rgba(255,255,255,0.03)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-zinc-950 dark:text-white">
          <Users className="h-5 w-5" />
          Owners
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-300">
          <div className="flex items-center gap-2 font-semibold text-zinc-950 dark:text-white">
            <Shield className="h-4 w-4" />
            {required ?? "..."} of {owners?.length ?? "..."} approvals required
          </div>
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            Owners are stored as the contract addresses ReviveSafe uses for
            approvals and execution on Asset Hub.
          </p>
        </div>

        <div className="space-y-3">
          {(owners ?? []).map((owner, index) => {
            const isCurrentOwner = owner.toLowerCase() === userAddress?.toLowerCase();

            return (
              <div
                key={owner}
                className="flex items-center justify-between rounded-2xl border border-zinc-200 p-3 dark:border-white/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-700 dark:bg-white/[0.06] dark:text-zinc-200">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm text-zinc-950 dark:text-white">
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

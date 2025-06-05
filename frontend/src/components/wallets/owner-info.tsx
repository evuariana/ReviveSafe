import { Users, Shield, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAddress } from "@/lib/utils";
import { Address } from "viem";

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
  if (!owners || !required) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Owners
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse h-20 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Owners ({owners.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            <Shield className="h-4 w-4 inline mr-2" />
            {required} of {owners.length} signatures required
          </div>

          <div className="space-y-2">
            {owners.map((owner, index) => (
              <div
                key={owner}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-mono text-sm">
                      {formatAddress(owner)}
                    </div>
                    {owner.toLowerCase() === userAddress?.toLowerCase() && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        You
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(owner)}
                  title="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

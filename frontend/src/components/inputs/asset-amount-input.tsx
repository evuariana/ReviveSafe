import type { HubAsset } from "@/types/revive";

import { BalanceInput } from "@/components/inputs/balance-input";

interface AssetAmountInputProps {
  asset: HubAsset | undefined;
  value?: string;
  onChange: (value?: string) => void;
  disabled?: boolean;
  maxBalance?: bigint;
  error?: string;
}

export function AssetAmountInput({
  asset,
  value,
  onChange,
  disabled,
  maxBalance,
  error,
}: AssetAmountInputProps) {
  return (
    <BalanceInput
      label={asset ? `Amount (${asset.symbol || `#${asset.id}`})` : "Amount"}
      value={value}
      onChange={onChange}
      symbol={asset?.symbol || "UNIT"}
      decimals={asset?.decimals ?? 0}
      disabled={disabled}
      maxPlanck={maxBalance}
      description={
        asset
          ? `${asset.name} via ${asset.precompileAddress}`
          : "Select an asset to set decimals and symbol"
      }
      error={error}
    />
  );
}

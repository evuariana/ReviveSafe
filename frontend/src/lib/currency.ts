import { formatUnits } from "viem";

export function formatTokenBalance(
  balance: bigint,
  decimals: number,
  precision = 4
): string {
  const formatted = formatUnits(balance, decimals);
  const parsed = Number.parseFloat(formatted);

  if (!Number.isFinite(parsed)) {
    return "0";
  }

  return parsed.toLocaleString(undefined, {
    maximumFractionDigits: precision,
  });
}

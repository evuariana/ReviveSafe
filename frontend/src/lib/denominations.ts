import { formatUnits, parseUnits } from "viem";

export interface Denomination {
  label: string;
  decimals: number;
  maxDecimals: number;
}

export function getDenominations(
  symbol: string,
  decimals: number
): Denomination[] {
  const result: Denomination[] = [
    {
      label: symbol,
      decimals,
      maxDecimals: decimals,
    },
  ];

  if (decimals >= 3) {
    result.push({
      label: `m${symbol}`,
      decimals: decimals - 3,
      maxDecimals: decimals - 3,
    });
  }

  result.push({
    label: "planck",
    decimals: 0,
    maxDecimals: 0,
  });

  return result;
}

function trimTrailingZeros(value: string): string {
  return value.replace(/(\.\d*?[1-9])0+$|\.0+$/, "$1");
}

export function fromPlanck(value: string | bigint, denomination: Denomination): string {
  const formatted = formatUnits(BigInt(value), denomination.decimals);
  return trimTrailingZeros(formatted);
}

export function toPlanck(
  value: string,
  denomination: Denomination
): string | null {
  const normalized = value.replace(/,/g, "").trim();

  if (!normalized) {
    return null;
  }

  if (denomination.decimals === 0 && normalized.includes(".")) {
    return null;
  }

  try {
    return parseUnits(normalized, denomination.decimals).toString();
  } catch {
    return null;
  }
}

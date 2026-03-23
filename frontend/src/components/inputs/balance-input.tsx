import { useEffect, useMemo, useState } from "react";

import {
  workspaceInputClassName,
  workspaceOutlineButtonClassName,
  workspaceSelectClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  fromPlanck,
  getDenominations,
  toPlanck,
  type Denomination,
} from "@/lib/denominations";

interface BalanceInputProps {
  label: string;
  value?: string;
  onChange: (value?: string) => void;
  symbol: string;
  decimals: number;
  description?: string;
  disabled?: boolean;
  maxPlanck?: bigint;
  error?: string;
}

export function BalanceInput({
  label,
  value,
  onChange,
  symbol,
  decimals,
  description,
  disabled,
  maxPlanck,
  error,
}: BalanceInputProps) {
  const denominations = useMemo(
    () => getDenominations(symbol, decimals),
    [decimals, symbol]
  );
  const [selectedLabel, setSelectedLabel] = useState(denominations[0]?.label ?? symbol);
  const [displayValue, setDisplayValue] = useState("");
  const selectedDenomination = useMemo<Denomination>(
    () =>
      denominations.find((denomination) => denomination.label === selectedLabel) ??
      denominations[0],
    [denominations, selectedLabel]
  );

  useEffect(() => {
    if (!value) {
      setDisplayValue("");
      return;
    }

    setDisplayValue(fromPlanck(value, selectedDenomination));
  }, [selectedDenomination, value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <select
          className={`${workspaceSelectClassName} h-9 w-auto rounded-full px-3 py-1 text-xs font-medium`}
          value={selectedDenomination.label}
          onChange={(event) => setSelectedLabel(event.target.value)}
          disabled={disabled}
        >
          {denominations.map((denomination) => (
            <option key={denomination.label} value={denomination.label}>
              {denomination.label}
            </option>
          ))}
        </select>
      </div>

      <Input
        inputMode={selectedDenomination.decimals === 0 ? "numeric" : "decimal"}
        className={`${workspaceInputClassName} font-mono`}
        disabled={disabled}
        placeholder={selectedDenomination.decimals === 0 ? "0" : "0.00"}
        value={displayValue}
        onChange={(event) => {
          const nextDisplayValue = event.target.value;
          setDisplayValue(nextDisplayValue);
          onChange(toPlanck(nextDisplayValue, selectedDenomination) ?? undefined);
        }}
      />

      {(description || maxPlanck !== undefined) && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{description}</span>
          {maxPlanck !== undefined && (
            <div className="flex items-center gap-1">
              {[25, 50, 100].map((percent) => (
                <Button
                  key={percent}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`h-7 rounded-full px-2 text-[11px] ${workspaceOutlineButtonClassName}`}
                  disabled={disabled}
                  onClick={() => {
                    const nextValue =
                      percent === 100
                        ? maxPlanck
                        : (maxPlanck * BigInt(percent)) / 100n;
                    onChange(nextValue.toString());
                    setDisplayValue(fromPlanck(nextValue.toString(), selectedDenomination));
                  }}
                >
                  {percent === 100 ? "Max" : `${percent}%`}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

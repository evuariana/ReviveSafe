import { useEffect, useState } from "react";

import {
  workspaceInputClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AmountInputProps {
  label: string;
  value?: string;
  onChange: (value?: string) => void;
  description?: string;
  disabled?: boolean;
  allowHex?: boolean;
  min?: number;
  max?: number;
  error?: string;
}

export function AmountInput({
  label,
  value,
  onChange,
  description,
  disabled,
  allowHex = false,
  min,
  max,
  error,
}: AmountInputProps) {
  const [mode, setMode] = useState<"dec" | "hex">("dec");
  const [displayValue, setDisplayValue] = useState(value ?? "");

  useEffect(() => {
    if (!value) {
      setDisplayValue("");
      return;
    }

    if (mode === "hex") {
      setDisplayValue(`0x${BigInt(value).toString(16)}`);
      return;
    }

    setDisplayValue(value);
  }, [mode, value]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        {allowHex && (
          <div className={`inline-flex p-1 text-[11px] font-medium ${workspacePanelMutedClassName}`}>
            {(["dec", "hex"] as const).map((nextMode) => (
              <button
                key={nextMode}
                type="button"
                className={`rounded-full px-2 py-1 ${
                  mode === nextMode
                    ? "bg-white text-zinc-900 shadow-sm dark:bg-white dark:text-black"
                    : "text-zinc-500 dark:text-zinc-400"
                }`}
                onClick={() => setMode(nextMode)}
                disabled={disabled}
              >
                {nextMode.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <Input
        className={`${workspaceInputClassName} font-mono`}
        disabled={disabled}
        value={displayValue}
        onChange={(event) => {
          const nextDisplayValue = event.target.value;
          setDisplayValue(nextDisplayValue);

          if (!nextDisplayValue.trim()) {
            onChange(undefined);
            return;
          }

          try {
            const nextValue =
              mode === "hex"
                ? BigInt(nextDisplayValue)
                : BigInt(nextDisplayValue.replace(/,/g, ""));

            if (min !== undefined && nextValue < BigInt(min)) {
              onChange(undefined);
              return;
            }

            if (max !== undefined && nextValue > BigInt(max)) {
              onChange(undefined);
              return;
            }

            onChange(nextValue.toString());
          } catch {
            onChange(undefined);
          }
        }}
      />

      {description && <p className="text-xs text-zinc-500 dark:text-zinc-400">{description}</p>}
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

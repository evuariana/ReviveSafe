import { useEffect, useMemo, useState } from "react";
import { UserRoundPlus } from "lucide-react";
import { getAddress, isAddress, type Address } from "viem";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useConnectedAccounts } from "@/hooks/useMappedAccount";
import { deriveMappingStatus } from "@/lib/account-mapping";

const STORAGE_KEY = "revivesafe.recentMappedAddresses";

function readRecentAddresses(): Address[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as string[];
    return parsed
      .filter((value): value is Address => isAddress(value))
      .map((value) => getAddress(value));
  } catch {
    return [];
  }
}

function persistRecentAddress(address: Address) {
  const next = Array.from(new Set([address, ...readRecentAddresses()])).slice(0, 6);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

function normalizeMappedInput(value: string): Address | undefined {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return undefined;
  }

  if (isAddress(normalizedValue)) {
    return getAddress(normalizedValue);
  }

  try {
    return deriveMappingStatus(normalizedValue).mappedH160;
  } catch {
    return undefined;
  }
}

interface MappedAccountInputProps {
  label: string;
  value?: Address;
  onChange: (value?: Address) => void;
  description?: string;
  disabled?: boolean;
  error?: string;
}

export function MappedAccountInput({
  label,
  value,
  onChange,
  description,
  disabled,
  error,
}: MappedAccountInputProps) {
  const accounts = useConnectedAccounts();
  const [inputValue, setInputValue] = useState(value ?? "");
  const [recentAddresses, setRecentAddresses] = useState<Address[]>([]);

  useEffect(() => {
    setRecentAddresses(readRecentAddresses());
  }, []);

  useEffect(() => {
    setInputValue(value ?? "");
  }, [value]);

  const accountOptions = useMemo(
    () =>
      accounts.map((account) => ({
        label: account.name
          ? `${account.name} (${account.mappedH160.slice(0, 6)}...${account.mappedH160.slice(-4)})`
          : account.mappedH160,
        value: account.mappedH160,
        source: account.address,
      })),
    [accounts]
  );
  const normalizedInputValue = useMemo(
    () => normalizeMappedInput(inputValue),
    [inputValue]
  );

  const commitValue = (nextValue: string) => {
    setInputValue(nextValue);

    const normalized = normalizeMappedInput(nextValue);

    if (!normalized) {
      onChange(undefined);
      return;
    }

    persistRecentAddress(normalized);
    setRecentAddresses(readRecentAddresses());
    onChange(normalized);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        className="font-mono"
        disabled={disabled}
        placeholder="0x..."
        value={inputValue}
        onChange={(event) => commitValue(event.target.value)}
      />

      {description && <p className="text-xs text-slate-500">{description}</p>}
      <p className="text-xs text-slate-500">
        Paste either a mapped H160 or a Polkadot SS58 address. ReviveSafe will
        use the mapped H160 on-chain.
      </p>
      {normalizedInputValue &&
        inputValue.trim() &&
        normalizedInputValue.toLowerCase() !== inputValue.trim().toLowerCase() && (
          <p className="text-xs text-emerald-700 dark:text-emerald-300">
            Resolved to {normalizedInputValue}
          </p>
        )}

      {accountOptions.length > 0 && (
        <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <UserRoundPlus className="h-3.5 w-3.5" />
            Connected accounts
          </div>
          <div className="flex flex-wrap gap-2">
            {accountOptions.map((option) => (
              <Button
                key={option.value}
                type="button"
                variant={value === option.value ? "default" : "outline"}
                size="sm"
                className="h-auto max-w-full rounded-full px-3 py-2 text-left"
                onClick={() => commitValue(option.value)}
                disabled={disabled}
              >
                <span className="flex flex-col items-start">
                  <span className="truncate text-xs font-semibold">
                    {option.label}
                  </span>
                  <span className="truncate text-[10px] opacity-70">
                    {option.source}
                  </span>
                </span>
              </Button>
            ))}
          </div>
        </div>
      )}

      {recentAddresses.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentAddresses.map((recentAddress) => (
            <Button
              key={recentAddress}
              type="button"
              variant="ghost"
              size="sm"
              className="h-auto rounded-full border border-slate-200 px-3 py-1 font-mono text-[11px]"
              onClick={() => commitValue(recentAddress)}
              disabled={disabled}
            >
              {recentAddress.slice(0, 8)}...{recentAddress.slice(-4)}
            </Button>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

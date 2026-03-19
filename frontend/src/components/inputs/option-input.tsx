import { useEffect, useState, type ReactNode } from "react";

interface OptionInputProps {
  label: string;
  description?: string;
  valueEnabled?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onToggle?: (enabled: boolean) => void;
}

export function OptionInput({
  label,
  description,
  valueEnabled,
  disabled,
  children,
  onToggle,
}: OptionInputProps) {
  const [enabled, setEnabled] = useState(Boolean(valueEnabled));

  useEffect(() => {
    setEnabled(Boolean(valueEnabled));
  }, [valueEnabled]);

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-medium text-slate-900">{label}</div>
          {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
        </div>
        <button
          type="button"
          className={`inline-flex h-7 items-center rounded-full border px-3 text-xs font-semibold transition-colors ${
            enabled
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-500"
          }`}
          disabled={disabled}
          onClick={() => {
            const nextValue = !enabled;
            setEnabled(nextValue);
            onToggle?.(nextValue);
          }}
        >
          {enabled ? "Some" : "None"}
        </button>
      </div>
      {enabled && <div>{children}</div>}
    </div>
  );
}

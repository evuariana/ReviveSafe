import { useMemo, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { isHex, type Hex } from "viem";

import {
  workspaceInputClassName,
  workspaceOutlineButtonClassName,
  workspacePanelMutedClassName,
} from "@/components/layout/workspace-surfaces";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BytesInputProps {
  label: string;
  value?: Hex;
  onChange: (value?: Hex) => void;
  description?: string;
  disabled?: boolean;
  error?: string;
}

export function BytesInput({
  label,
  value,
  onChange,
  description,
  disabled,
  error,
}: BytesInputProps) {
  const [mode, setMode] = useState<"hex" | "text" | "file">("hex");
  const [displayHex, setDisplayHex] = useState(value ?? "0x");
  const [displayText, setDisplayText] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const byteCount = useMemo(() => {
    if (!displayHex || displayHex === "0x") {
      return 0;
    }

    return (displayHex.length - 2) / 2;
  }, [displayHex]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className={`inline-flex p-1 text-[11px] font-medium ${workspacePanelMutedClassName}`}>
          {(["hex", "text", "file"] as const).map((nextMode) => (
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
      </div>

      {mode === "hex" && (
        <Input
          className={`${workspaceInputClassName} font-mono`}
          disabled={disabled}
          value={displayHex}
          onChange={(event) => {
            const nextValue = event.target.value.trim() || "0x";
            const normalized = nextValue.startsWith("0x")
              ? nextValue
              : `0x${nextValue}`;
            setDisplayHex(normalized as Hex);
            onChange(
              isHex(normalized) && normalized.length % 2 === 0
                ? (normalized as Hex)
                : undefined
            );
          }}
        />
      )}

      {mode === "text" && (
        <Textarea
          className={`${workspaceInputClassName} min-h-28 font-mono`}
          disabled={disabled}
          value={displayText}
          onChange={(event) => {
            const nextValue = event.target.value;
            setDisplayText(nextValue);
            const encoded = new TextEncoder().encode(nextValue);
            const hex = `0x${Array.from(encoded, (byte) =>
              byte.toString(16).padStart(2, "0")
            ).join("")}` as Hex;
            setDisplayHex(hex);
            onChange(hex);
          }}
        />
      )}

      {mode === "file" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) {
                return;
              }

              const reader = new FileReader();
              reader.onload = () => {
                const buffer = reader.result as ArrayBuffer;
                const bytes = new Uint8Array(buffer);
                const hex = `0x${Array.from(bytes, (byte) =>
                  byte.toString(16).padStart(2, "0")
                ).join("")}` as Hex;
                setDisplayHex(hex);
                onChange(hex);
              };
              reader.readAsArrayBuffer(file);
            }}
          />
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-center rounded-xl ${workspaceOutlineButtonClassName}`}
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
          >
            <Upload className="h-4 w-4" />
            Choose file
          </Button>
          <div
            className={`truncate px-3 py-2 text-xs font-mono text-zinc-600 dark:text-zinc-300 ${workspacePanelMutedClassName}`}
          >
            {displayHex}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <span>{description}</span>
        <span>{byteCount} bytes</span>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}

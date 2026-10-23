"use client";

import { cn } from "cn";
import { useState } from "react";
import { parseDecimal } from "@/lib/inspection/format";

/**
 * Number field with the phone's decimal keypad and the unit inside the field.
 * Keeps the typed text ("12,") while the parent only sees valid numbers.
 */
export function DecimalInput({
  value,
  onChange,
  unit,
  label,
  placeholder = "0",
  size = "default",
  autoFocus,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  unit?: string;
  label: string;
  placeholder?: string;
  size?: "default" | "lg";
  autoFocus?: boolean;
}) {
  const [text, setText] = useState(value === null ? "" : String(value).replace(".", ","));
  const [lastValue, setLastValue] = useState(value);

  // The parent changed the value (e.g. a suggestion was applied): show it.
  if (value !== lastValue) {
    setLastValue(value);
    if (parseDecimal(text) !== value)
      setText(value === null ? "" : String(value).replace(".", ","));
  }

  return (
    <label
      className={cn(
        "bg-background focus-within:border-ring focus-within:ring-ring/50 flex items-center rounded-xl border px-3 focus-within:ring-3",
        size === "lg" ? "h-16" : "h-12",
      )}
    >
      <input
        aria-label={label}
        inputMode="decimal"
        enterKeyHint="done"
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          const next = event.target.value.replace(/[^\d.,]/g, "");
          setText(next);
          const parsed = parseDecimal(next);
          setLastValue(parsed);
          onChange(parsed);
        }}
        className={cn(
          "placeholder:text-muted-foreground/60 w-full min-w-0 bg-transparent font-semibold tabular-nums outline-none",
          size === "lg" ? "text-3xl" : "text-lg",
        )}
      />
      {unit && <span className="text-muted-foreground shrink-0 pl-2 text-sm">{unit}</span>}
    </label>
  );
}

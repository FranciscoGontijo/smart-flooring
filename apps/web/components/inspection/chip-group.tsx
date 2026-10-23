"use client";

import { cn } from "cn";

export type ChipOption<T extends string> = { value: T; label: string };

/** Single choice as big tappable chips; easier than a select on a phone. */
export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
  label,
  allowDeselect = false,
  size = "default",
}: {
  options: ChipOption<T>[];
  value: T | null;
  onChange: (value: T | null) => void;
  label: string;
  allowDeselect?: boolean;
  size?: "default" | "sm";
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(selected && allowDeselect ? null : option.value)}
            className={cn(
              "rounded-full border px-4 font-medium transition-colors active:scale-[0.98]",
              size === "sm" ? "h-9 text-sm" : "h-11 text-[15px]",
              selected
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

/** Builds chip options from a label map. */
export function optionsFrom<T extends string>(labels: Record<T, string>): ChipOption<T>[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

"use client";

import { Minus, Plus } from "lucide-react";

export function Stepper({
  value,
  onChange,
  label,
  min = 0,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[15px]">{label}</span>
      <div className="flex items-center rounded-full border">
        <button
          type="button"
          aria-label={`Diminuir ${label}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="hover:bg-muted flex size-11 items-center justify-center rounded-full disabled:opacity-30"
        >
          <Minus className="size-4" />
        </button>
        <span className="w-8 text-center text-base font-semibold tabular-nums" aria-live="polite">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Aumentar ${label}`}
          onClick={() => onChange(value + 1)}
          className="hover:bg-muted flex size-11 items-center justify-center rounded-full"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}

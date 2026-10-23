import { UNIT_LABEL, type Unit } from "./catalog";

const number = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });

export function formatQuantity(value: number, unit: Unit): string {
  return `${number.format(value)} ${UNIT_LABEL[unit]}`;
}

export function formatNumber(value: number): string {
  return number.format(value);
}

/** "12,5" or "12.5" → 12.5; anything else → null. */
export function parseDecimal(input: string): number | null {
  const normalized = input.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

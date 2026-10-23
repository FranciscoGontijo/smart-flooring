import { DEFAULT_WASTE, quantityWithWaste } from "@smart-flooring/shared";
import { getService, type Unit } from "./catalog";

export type WorkLine = { serviceId: string; quantity: number; area?: string };

export type MaterialLine = {
  key: string;
  name: string;
  unit: Unit;
  measured: number;
  /** null: no waste applies. */
  waste: number | null;
  total: number;
  /** Consumption guide still to be defined (docs, section 4.4). */
  pending?: boolean;
};

const FLOOR_MATERIAL: Record<string, string> = {
  "in-lvp": "Floating floor (LVP)",
  "in-lvp-diag": "Floating floor (LVP)",
  "in-laminate": "Laminate",
  "in-hardwood": "Hardwood",
  "in-herringbone": "Herringbone floor",
  "in-tile": "Tile",
  "in-tile-diag": "Tile",
};

const NEEDS_UNDERLAYMENT = new Set(["in-lvp", "in-lvp-diag", "in-laminate"]);
const NEEDS_THINSET = new Set(["in-tile", "in-tile-diag"]);

/**
 * Generic material list from the work lines (product type only, no brand).
 * The real rules come from the consumption guide; this is the mock version.
 */
export function deriveMaterials(lines: WorkLine[]): MaterialLine[] {
  const totals = new Map<string, MaterialLine>();

  const add = (key: string, name: string, unit: Unit, measured: number, waste: number | null) => {
    const current = totals.get(key);
    const nextMeasured = (current?.measured ?? 0) + measured;
    totals.set(key, {
      key,
      name,
      unit,
      measured: nextMeasured,
      waste,
      total: waste === null ? nextMeasured : quantityWithWaste(nextMeasured, waste),
      pending: current?.pending,
    });
  };

  for (const line of lines) {
    const service = getService(line.serviceId);
    if (line.quantity <= 0) continue;

    const floor = FLOOR_MATERIAL[service.id];
    if (floor && service.waste) {
      const waste = DEFAULT_WASTE[service.waste];
      // Same product with different waste (straight vs diagonal) stays in separate rows.
      add(`${floor}-${waste}`, floor, "sq_ft", line.quantity, waste);
    }
    if (NEEDS_UNDERLAYMENT.has(service.id)) {
      add("underlayment", "Underlayment", "sq_ft", line.quantity, DEFAULT_WASTE.floating_standard);
    }
    if (NEEDS_THINSET.has(service.id)) {
      add("thinset", "Thin-set", "sq_ft", line.quantity, null);
      totals.get("thinset")!.pending = true;
    }
    if (service.id === "fn-quarter") add("quarter", "Quarter round", "lf", line.quantity, 0.1);
    if (service.id === "fn-baseboard") add("baseboard", "Baseboard", "lf", line.quantity, 0.1);
    if (service.id === "fn-transition")
      add("transition", "Transition strip", "each", line.quantity, null);
    if (service.id === "fn-stairnose") add("stairnose", "Stair nose", "each", line.quantity, null);
    if (service.id === "pr-level") {
      add("leveler", "Self-leveling compound", "sq_ft", line.quantity, null);
      totals.get("leveler")!.pending = true;
    }
    if (service.id === "pr-moisture") {
      add("barrier", "Moisture barrier", "sq_ft", line.quantity, DEFAULT_WASTE.floating_standard);
    }
  }

  return [...totals.values()];
}

/** Sums the work lines by service (for the summary). */
export function totalsByService(lines: WorkLine[]): { serviceId: string; quantity: number }[] {
  const totals = new Map<string, number>();
  for (const line of lines) {
    totals.set(line.serviceId, (totals.get(line.serviceId) ?? 0) + line.quantity);
  }
  return [...totals].map(([serviceId, quantity]) => ({ serviceId, quantity }));
}

import type { WorkLine } from "./materials";

/** Pattern 1: one line per piece of work, QuickBooks style. */
export type Line = WorkLine & { id: string; note?: string };

export const EXAMPLE_LINES: Line[] = [
  { id: "l1", serviceId: "rm-carpet", area: "Living room", quantity: 320 },
  { id: "l2", serviceId: "in-lvp", area: "Living room", quantity: 320 },
  { id: "l3", serviceId: "fn-quarter", area: "Living room", quantity: 74 },
  { id: "l4", serviceId: "rm-floating", area: "Hallway", quantity: 96 },
  { id: "l5", serviceId: "in-lvp", area: "Hallway", quantity: 96 },
  {
    id: "l6",
    serviceId: "rm-tile",
    area: "Kitchen",
    quantity: 180,
    note: "Tile antigo, provavelmente com mortar grosso.",
  },
  {
    id: "l7",
    serviceId: "pr-level",
    area: "Kitchen",
    quantity: 60,
    note: "Desnível perto da pia.",
  },
  { id: "l8", serviceId: "in-tile", area: "Kitchen", quantity: 180 },
  { id: "l9", serviceId: "fn-transition", area: "Kitchen", quantity: 2 },
];

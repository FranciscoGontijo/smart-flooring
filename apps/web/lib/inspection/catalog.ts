import type { WasteType } from "@smart-flooring/shared";

// Mocked catalog. Service names stay in English (they go to US documents);
// the UI around them is in Portuguese.

export type Unit = "sq_ft" | "lf" | "each" | "step" | "room" | "job";

export const UNIT_LABEL: Record<Unit, string> = {
  sq_ft: "sq ft",
  lf: "lf",
  each: "un",
  step: "degrau",
  room: "cômodo",
  job: "serviço",
};

export type ServiceCategory = "removal" | "install" | "prep" | "finish" | "other";

export const CATEGORY_LABEL: Record<ServiceCategory, string> = {
  removal: "Remoção",
  install: "Instalação",
  prep: "Preparação",
  finish: "Acabamento",
  other: "Outros",
};

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  unit: Unit;
  /** Installation services: the material gets this waste. */
  waste?: WasteType;
};

export const SERVICES: Service[] = [
  { id: "rm-carpet", name: "Remove carpet & pad", category: "removal", unit: "sq_ft" },
  { id: "rm-floating", name: "Remove floating floor", category: "removal", unit: "sq_ft" },
  { id: "rm-gluedown", name: "Remove glue-down vinyl", category: "removal", unit: "sq_ft" },
  { id: "rm-tile", name: "Remove tile", category: "removal", unit: "sq_ft" },
  { id: "rm-hardwood", name: "Remove hardwood", category: "removal", unit: "sq_ft" },
  { id: "rm-baseboard", name: "Remove baseboard", category: "removal", unit: "lf" },
  {
    id: "in-lvp",
    name: "Install LVP (floating)",
    category: "install",
    unit: "sq_ft",
    waste: "floating_standard",
  },
  {
    id: "in-lvp-diag",
    name: "Install LVP diagonal",
    category: "install",
    unit: "sq_ft",
    waste: "lvp_diagonal",
  },
  {
    id: "in-laminate",
    name: "Install laminate",
    category: "install",
    unit: "sq_ft",
    waste: "floating_standard",
  },
  {
    id: "in-hardwood",
    name: "Install hardwood",
    category: "install",
    unit: "sq_ft",
    waste: "hardwood_standard",
  },
  {
    id: "in-herringbone",
    name: "Install herringbone",
    category: "install",
    unit: "sq_ft",
    waste: "herringbone",
  },
  {
    id: "in-tile",
    name: "Install tile",
    category: "install",
    unit: "sq_ft",
    waste: "tile_standard",
  },
  {
    id: "in-tile-diag",
    name: "Install tile diagonal",
    category: "install",
    unit: "sq_ft",
    waste: "tile_diagonal",
  },
  { id: "pr-level", name: "Floor leveling", category: "prep", unit: "sq_ft" },
  { id: "pr-moisture", name: "Moisture barrier", category: "prep", unit: "sq_ft" },
  { id: "pr-subfloor", name: "Subfloor repair (plywood)", category: "prep", unit: "sq_ft" },
  { id: "fn-baseboard", name: "Install baseboard", category: "finish", unit: "lf" },
  { id: "fn-quarter", name: "Install quarter round", category: "finish", unit: "lf" },
  { id: "fn-transition", name: "Transition", category: "finish", unit: "each" },
  { id: "fn-stairnose", name: "Stair nosing", category: "finish", unit: "each" },
  { id: "fn-stairs", name: "Install stairs", category: "finish", unit: "step" },
  { id: "ot-furniture", name: "Move furniture", category: "other", unit: "room" },
  { id: "ot-toilet", name: "Toilet removal & reset", category: "other", unit: "each" },
  { id: "ot-appliance", name: "Move appliance", category: "other", unit: "each" },
  { id: "ot-haul", name: "Haul away debris", category: "other", unit: "job" },
];

export const SERVICE_BY_ID = new Map(SERVICES.map((s) => [s.id, s]));

export function getService(id: string): Service {
  const service = SERVICE_BY_ID.get(id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

/** Most used first: what the inspector sees before typing anything. */
export const FREQUENT_SERVICE_IDS = [
  "rm-carpet",
  "rm-floating",
  "in-lvp",
  "in-tile",
  "fn-quarter",
  "fn-baseboard",
  "fn-transition",
  "pr-level",
];

export const AREA_PRESETS = [
  "Living room",
  "Dining room",
  "Kitchen",
  "Hallway",
  "Master bedroom",
  "Bedroom 2",
  "Bedroom 3",
  "Bathroom",
  "Laundry",
  "Closet",
  "Office",
  "Entry",
  "Stairs",
  "Basement",
];

export type CurrentFloor = "carpet" | "floating" | "glue_down" | "tile" | "hardwood" | "concrete";

export const CURRENT_FLOOR_LABEL: Record<CurrentFloor, string> = {
  carpet: "Carpet",
  floating: "Floating / LVP",
  glue_down: "Vinil colado",
  tile: "Tile",
  hardwood: "Hardwood",
  concrete: "Concreto (sem piso)",
};

/** Removal service for each current floor (concrete has nothing to remove). */
export const REMOVAL_SERVICE: Record<CurrentFloor, string | null> = {
  carpet: "rm-carpet",
  floating: "rm-floating",
  glue_down: "rm-gluedown",
  tile: "rm-tile",
  hardwood: "rm-hardwood",
  concrete: null,
};

export type NewFloor = "lvp" | "laminate" | "hardwood" | "tile";

export const NEW_FLOOR_LABEL: Record<NewFloor, string> = {
  lvp: "LVP (floating)",
  laminate: "Laminado",
  hardwood: "Hardwood",
  tile: "Tile",
};

export type Pattern = "straight" | "diagonal" | "herringbone";

export const PATTERN_LABEL: Record<Pattern, string> = {
  straight: "Reto",
  diagonal: "Diagonal",
  herringbone: "Herringbone",
};

/** Install service for a floor + pattern. */
export function installServiceId(floor: NewFloor, pattern: Pattern): string {
  if (pattern === "herringbone") return "in-herringbone";
  if (floor === "tile") return pattern === "diagonal" ? "in-tile-diag" : "in-tile";
  if (pattern === "diagonal") return "in-lvp-diag";
  return { lvp: "in-lvp", laminate: "in-laminate", hardwood: "in-hardwood" }[floor];
}

export type Subfloor = "concrete" | "wood";

export const SUBFLOOR_LABEL: Record<Subfloor, string> = {
  concrete: "Concreto",
  wood: "Madeira (plywood/OSB)",
};

export type BaseboardAction = "keep" | "replace" | "new";

export const BASEBOARD_LABEL: Record<BaseboardAction, string> = {
  keep: "Manter",
  replace: "Trocar",
  new: "Instalar novo",
};

export type MoistureMethod = "pinless" | "pin" | "rh" | "calcium";

export const MOISTURE_METHOD_LABEL: Record<MoistureMethod, string> = {
  pinless: "Pinless",
  pin: "Pin",
  rh: "RH",
  calcium: "Calcium chloride",
};

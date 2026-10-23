/** Default waste by floor type and installation. Section 4.4. */
export const DEFAULT_WASTE = {
  floating_standard: 0.1,
  hardwood_standard: 0.1,
  tile_standard: 0.12,
  tile_diagonal: 0.17,
  lvp_diagonal: 0.17,
  herringbone: 0.17,
} as const;

export type WasteType = keyof typeof DEFAULT_WASTE;

/** Measured quantity plus waste, rounded up to a whole unit. */
export function quantityWithWaste(measured: number, waste: number): number {
  if (measured < 0 || waste < 0) {
    throw new RangeError("Quantity and waste can't be negative.");
  }
  // Round to 6 decimals first so float noise (500 * 1.1 = 550.0000000000001) doesn't add a unit.
  return Math.ceil(Number((measured * (1 + waste)).toFixed(6)));
}

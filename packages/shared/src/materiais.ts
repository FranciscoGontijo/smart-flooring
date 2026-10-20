/** Default waste by floor type and installation. Section 4.4. */
export const WASTE_PADRAO = {
  floating_normal: 0.1,
  hardwood_normal: 0.1,
  tile_normal: 0.12,
  tile_diagonal: 0.17,
  lvp_diagonal: 0.17,
  herringbone: 0.17,
} as const;

export type TipoWaste = keyof typeof WASTE_PADRAO;

/** Measured quantity plus waste, rounded up to a whole unit. */
export function quantidadeComWaste(qtdMedida: number, waste: number): number {
  if (qtdMedida < 0 || waste < 0) {
    throw new RangeError("Quantidade e waste não podem ser negativos.");
  }
  // Round to 6 decimals first so float noise (500 * 1.1 = 550.0000000000001) doesn't add a unit.
  return Math.ceil(Number((qtdMedida * (1 + waste)).toFixed(6)));
}

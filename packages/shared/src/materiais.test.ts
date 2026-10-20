import { describe, expect, it } from "vitest";
import { quantidadeComWaste, WASTE_PADRAO } from "./materiais.js";

describe("quantidadeComWaste", () => {
  it("applies 10% to floating floor without float noise", () => {
    expect(quantidadeComWaste(500, WASTE_PADRAO.floating_normal)).toBe(550);
  });

  it("rounds up to a whole unit", () => {
    expect(quantidadeComWaste(101, WASTE_PADRAO.tile_normal)).toBe(114);
  });

  it("rejects negative values", () => {
    expect(() => quantidadeComWaste(-1, 0.1)).toThrow(RangeError);
  });
});

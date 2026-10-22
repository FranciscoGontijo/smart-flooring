import { describe, expect, it } from "vitest";
import { DEFAULT_WASTE, quantityWithWaste } from "./materials.js";

describe("quantityWithWaste", () => {
  it("applies 10% to floating floor without float noise", () => {
    expect(quantityWithWaste(500, DEFAULT_WASTE.floating_standard)).toBe(550);
  });

  it("rounds up to a whole unit", () => {
    expect(quantityWithWaste(101, DEFAULT_WASTE.tile_standard)).toBe(114);
  });

  it("rejects negative values", () => {
    expect(() => quantityWithWaste(-1, 0.1)).toThrow(RangeError);
  });
});

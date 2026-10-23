import { describe, expect, it } from "vitest";
import { closeProjectSchema } from "./projects.js";

describe("closeProjectSchema", () => {
  it("requires a note when the reason is 'other'", () => {
    expect(closeProjectSchema.safeParse({ reason: "other" }).success).toBe(false);
    expect(closeProjectSchema.safeParse({ reason: "other", note: "moved away" }).success).toBe(
      true,
    );
  });

  it("accepts a fixed reason without a note", () => {
    expect(closeProjectSchema.safeParse({ reason: "price" }).success).toBe(true);
  });
});

import { describe, expect, it } from "vitest";
import { fecharProjetoSchema } from "./projetos.js";

describe("fecharProjetoSchema", () => {
  it("requires a note when the reason is 'outro'", () => {
    expect(fecharProjetoSchema.safeParse({ motivo: "outro" }).success).toBe(false);
    expect(
      fecharProjetoSchema.safeParse({ motivo: "outro", nota: "mudou de cidade" }).success,
    ).toBe(true);
  });

  it("accepts a fixed reason without a note", () => {
    expect(fecharProjetoSchema.safeParse({ motivo: "preco" }).success).toBe(true);
  });
});

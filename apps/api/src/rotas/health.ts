import type { Health } from "@smart-flooring/shared";
import { Router } from "express";

export function rotasHealth(verificarBanco: () => Promise<void>): Router {
  const rotas = Router();

  rotas.get("/health", async (req, res) => {
    let db: Health["db"] = "ok";
    try {
      await verificarBanco();
    } catch (err) {
      req.log.error({ err }, "health: banco indisponível");
      db = "erro";
    }
    const corpo: Health = { status: "ok", db };
    res.status(db === "ok" ? 200 : 503).json(corpo);
  });

  return rotas;
}

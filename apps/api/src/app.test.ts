import { pino } from "pino";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { criarApp } from "./app.js";

const logger = pino({ level: "silent" });

function app(verificarBanco: () => Promise<void>) {
  return criarApp({ logger, webUrl: "http://localhost:3000", verificarBanco });
}

describe("GET /health", () => {
  it("returns 200 when the database answers", async () => {
    const res = await request(app(async () => {})).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", db: "ok" });
  });

  it("returns 503 when the database fails", async () => {
    const res = await request(
      app(async () => {
        throw new Error("down");
      }),
    ).get("/health");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: "ok", db: "erro" });
  });
});

describe("unknown routes", () => {
  it("returns 404 in JSON", async () => {
    const res = await request(app(async () => {})).get("/nao-existe");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ erro: "Rota não encontrada." });
  });

  it("allows only the web origin with credentials", async () => {
    const res = await request(app(async () => {}))
      .get("/health")
      .set("Origin", "http://localhost:3000");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});

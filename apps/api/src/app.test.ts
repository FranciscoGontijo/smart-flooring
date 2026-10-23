import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "./app.js";

const app = createApp();

describe("cross-cutting behavior", () => {
  it("returns ROUTE_NOT_FOUND with the request id for unknown routes", async () => {
    const res = await request(app).get("/does-not-exist").set("X-Request-Id", "abc-123");
    expect(res.status).toBe(404);
    expect(res.headers["x-request-id"]).toBe("abc-123");
    expect(res.body).toEqual({
      error: { code: "ROUTE_NOT_FOUND", message: "Rota não encontrada.", requestId: "abc-123" },
    });
  });

  it("generates a request id when the client sends an unsafe one", async () => {
    const res = await request(app).get("/does-not-exist").set("X-Request-Id", "bad id!");
    expect(res.headers["x-request-id"]).toMatch(/^[0-9a-f-]{36}$/);
  });

  it("answers MALFORMED_JSON for an invalid JSON body", async () => {
    const res = await request(app)
      .post("/health")
      .set("Content-Type", "application/json")
      .send("{not json");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("MALFORMED_JSON");
  });

  it("allows only the web origin, with credentials", async () => {
    const res = await request(app).get("/does-not-exist").set("Origin", "http://localhost:3000");
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:3000");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });
});

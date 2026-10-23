import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../app.js";
import { healthRepository } from "./health.repository.js";

vi.mock("./health.repository.js", () => ({
  healthRepository: { ping: vi.fn() },
}));

const ping = vi.mocked(healthRepository.ping);
const app = createApp();

describe("GET /health", () => {
  beforeEach(() => {
    ping.mockReset();
  });

  it("returns 200 when the database answers", async () => {
    ping.mockResolvedValue();
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok", database: "ok" });
  });

  it("returns 503 when the database fails", async () => {
    ping.mockRejectedValue(new Error("down"));
    const res = await request(app).get("/health");
    expect(res.status).toBe(503);
    expect(res.body).toEqual({ status: "ok", database: "error" });
  });
});

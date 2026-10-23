import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { errorHandler } from "./error-handler.js";
import { requestId } from "./request-id.js";
import { validateBody } from "./validate.js";

const app = express()
  .use(requestId)
  .use((req, _res, next) => {
    // pino-http is not mounted here; the error handler only needs `req.log` for 500s.
    req.log = { error: () => {} } as unknown as typeof req.log;
    next();
  })
  .use(express.json())
  .post("/", validateBody(z.object({ name: z.string().min(1) })), (req, res) => {
    res.json(req.body);
  })
  .use(errorHandler);

describe("validateBody", () => {
  it("passes the parsed body on", async () => {
    const res = await request(app).post("/").send({ name: "Ana", extra: true });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ name: "Ana" });
  });

  it("answers VALIDATION_ERROR with the field errors", async () => {
    const res = await request(app).post("/").send({ name: "" });
    expect(res.status).toBe(422);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details).toEqual([{ field: "name", message: expect.any(String) }]);
  });
});

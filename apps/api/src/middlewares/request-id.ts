import { randomUUID } from "node:crypto";
import type { RequestHandler } from "express";

const SAFE_ID = /^[\w-]{1,64}$/;

/** Gives each request an ID: it goes in the log and in the error body, to find the log of a reported error. */
export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.get("X-Request-Id");
  req.requestId = incoming && SAFE_ID.test(incoming) ? incoming : randomUUID();
  res.set("X-Request-Id", req.requestId);
  next();
};

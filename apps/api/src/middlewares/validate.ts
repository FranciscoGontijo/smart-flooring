import type { RequestHandler } from "express";
import type { z } from "zod";
import { parseOrThrow } from "../lib/validation.js";

/** Validates and replaces `req.body`; an invalid body becomes a 422 with the field errors. */
export function validateBody(schema: z.ZodType): RequestHandler {
  return (req, _res, next) => {
    req.body = parseOrThrow(schema, req.body);
    next();
  };
}

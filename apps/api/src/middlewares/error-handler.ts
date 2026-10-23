import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError } from "../lib/errors.js";
import { fromZodError } from "../lib/validation.js";

/** Errors thrown by express.json() carry a `type`. */
function fromBodyParser(err: unknown): AppError | undefined {
  const type = (err as { type?: unknown } | null)?.type;
  if (type === "entity.parse.failed") return new AppError("MALFORMED_JSON", { cause: err });
  if (type === "entity.too.large") return new AppError("PAYLOAD_TOO_LARGE", { cause: err });
  return undefined;
}

/** The last middleware: turns any error into `{ error: { code, message, details?, requestId } }`. */
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const appError =
    err instanceof AppError
      ? err
      : err instanceof ZodError
        ? fromZodError(err)
        : fromBodyParser(err);

  if (!appError) {
    req.log.error({ err }, "unhandled error");
  } else if (appError.status >= 500) {
    req.log.error({ err: appError }, appError.code);
  }

  const error = appError ?? new AppError("INTERNAL_ERROR");
  res.status(error.status).json({
    error: {
      code: error.code,
      message: error.message,
      ...(error.details ? { details: error.details } : {}),
      requestId: req.requestId,
    },
  });
};

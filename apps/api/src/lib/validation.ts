import type { z, ZodError } from "zod";
import { AppError } from "./errors.js";

export function fromZodError(err: ZodError): AppError {
  return new AppError("VALIDATION_ERROR", {
    cause: err,
    details: err.issues.map((issue) => ({
      field: issue.path.join(".") || "(root)",
      message: issue.message,
    })),
  });
}

/** Parses with a zod schema; failures become a VALIDATION_ERROR (422). */
export function parseOrThrow<S extends z.ZodType>(schema: S, value: unknown): z.output<S> {
  const result = schema.safeParse(value);
  if (!result.success) throw fromZodError(result.error);
  return result.data;
}

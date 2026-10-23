import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "./errors.js";

/** A unique index was violated. The service decides what that means in the domain. */
export class UniqueConstraintError extends Error {
  /** Index name ("users_email_key") or field names, whichever Prisma reports. */
  readonly targets: string[];

  constructor(targets: string[], options?: ErrorOptions) {
    super(`Unique constraint failed: ${targets.join(", ") || "(unknown)"}`, options);
    this.name = "UniqueConstraintError";
    this.targets = targets;
  }

  /** Was the violation on this field's unique index? */
  isOn(field: string): boolean {
    return this.targets.some((t) => t === field || t.split("_").includes(field));
  }
}

/** The WHERE of an update/delete matched no row (P2025). */
export class RecordNotFoundError extends Error {
  constructor(options?: ErrorOptions) {
    super("Record not found", options);
    this.name = "RecordNotFoundError";
  }
}

const UNAVAILABLE_PRISMA_CODES = new Set(["P1001", "P1002", "P1008", "P1017", "P2024"]);
// With adapter-pg a database that is down arrives as a Node network error, not as P1001.
const UNAVAILABLE_NODE_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ETIMEDOUT",
  "ENOTFOUND",
  "EAI_AGAIN",
  "EPIPE",
]);
// Postgres SQLSTATE: 57014 statement_timeout, 57P01–03 server shutting down/starting,
// 53300 too many connections.
const UNAVAILABLE_SQLSTATES = new Set(["57014", "57P01", "57P02", "57P03", "53300"]);
// 40001 serialization_failure, 40P01 deadlock_detected: the operation can be retried.
const RETRYABLE_SQLSTATES = new Set(["40001", "40P01"]);
// pg-pool throws a plain Error, without a code, when it can't get a connection in time.
const POOL_TIMEOUT_MESSAGES = [
  "timeout exceeded when trying to connect",
  "Connection terminated due to connection timeout",
  "Connection terminated unexpectedly",
];

/**
 * Translates a Prisma error into an application error. Repositories call this on every
 * database access, so no raw Prisma error reaches a service. Returns the error itself when
 * it isn't recognized: the error handler then treats it as a 500.
 */
export function translatePrismaError(err: unknown): unknown {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const sqlState = adapterCause(err.meta)?.originalCode;

    if (err.code === "P2002") {
      return new UniqueConstraintError(uniqueTargets(err.meta), { cause: err });
    }
    if (err.code === "P2025") return new RecordNotFoundError({ cause: err });
    if (
      err.code === "P2034" ||
      (typeof sqlState === "string" && RETRYABLE_SQLSTATES.has(sqlState))
    ) {
      return new AppError("CONCURRENT_MODIFICATION", { cause: err });
    }
    if (
      UNAVAILABLE_PRISMA_CODES.has(err.code) ||
      UNAVAILABLE_NODE_CODES.has(err.code) ||
      (typeof sqlState === "string" &&
        (UNAVAILABLE_SQLSTATES.has(sqlState) || sqlState.startsWith("08")))
    ) {
      return new AppError("SERVICE_UNAVAILABLE", { cause: err });
    }
    return err;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    return new AppError("SERVICE_UNAVAILABLE", { cause: err });
  }

  if (err instanceof Error) {
    const code = (err as NodeJS.ErrnoException).code;
    if (
      (typeof code === "string" && UNAVAILABLE_NODE_CODES.has(code)) ||
      POOL_TIMEOUT_MESSAGES.some((m) => err.message.includes(m))
    ) {
      return new AppError("SERVICE_UNAVAILABLE", { cause: err });
    }
  }

  // PrismaClientValidationError (a bug in our code), Unknown, P1000 (wrong password)…
  return err;
}

/** Runs a database call and translates its errors. Use it in every repository method. */
export async function db<T>(query: () => Promise<T>): Promise<T> {
  try {
    return await query();
  } catch (err) {
    throw translatePrismaError(err);
  }
}

/**
 * Without an adapter Prisma puts the index in `meta.target`. With adapter-pg (Prisma 7)
 * `meta.target` does NOT exist: it comes in `meta.driverAdapterError.cause.constraint`.
 */
function uniqueTargets(meta: Record<string, unknown> | undefined): string[] {
  const target = meta?.target;
  if (typeof target === "string") return [target];
  if (Array.isArray(target)) return target.map(String);

  const constraint = adapterCause(meta)?.constraint;
  if (isRecord(constraint)) {
    if (typeof constraint.index === "string") return [constraint.index];
    if (Array.isArray(constraint.fields)) return constraint.fields.map(String);
  }
  return [];
}

function adapterCause(
  meta: Record<string, unknown> | undefined,
): Record<string, unknown> | undefined {
  const adapterError = meta?.driverAdapterError;
  return isRecord(adapterError) && isRecord(adapterError.cause) ? adapterError.cause : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

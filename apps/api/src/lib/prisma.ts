import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "../config/env.js";
import { PrismaClient } from "../generated/prisma/client.js";

// Without these two limits a stuck database leaves the request hanging forever and no error
// ever reaches the error handler. With them it becomes a 503.
const adapter = new PrismaPg({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: 5_000, // max wait for a pool connection
  statement_timeout: 10_000, // max duration of a query in Postgres
});

export const prisma = new PrismaClient({ adapter });

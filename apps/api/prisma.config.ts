import { defineConfig } from "prisma/config";

// Prisma 7 does not load .env by itself.
try {
  process.loadEnvFile(".env");
} catch {
  // No .env (CI, Docker): the variables come from the environment.
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations need a direct connection (on Supabase, the session pooler or the direct host).
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});

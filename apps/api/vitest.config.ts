import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // src/config/env.ts validates at import time. Tests never reach the database:
    // repositories are mocked.
    env: {
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      DATABASE_URL: "postgresql://test:test@localhost:5432/test",
      WEB_URL: "http://localhost:3000",
    },
  },
});

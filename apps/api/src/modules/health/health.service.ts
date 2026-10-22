import type { Health } from "@smart-flooring/shared";
import { logger } from "../../lib/logger.js";
import { healthRepository } from "./health.repository.js";

export const healthService = {
  async check(): Promise<Health> {
    try {
      await healthRepository.ping();
      return { status: "ok", database: "ok" };
    } catch (err) {
      logger.error({ err }, "health: database unavailable");
      return { status: "ok", database: "error" };
    }
  },
};

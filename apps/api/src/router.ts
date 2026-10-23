import { Router } from "express";
import { healthRoutes } from "./modules/health/health.routes.js";

/** Mounts every module under its path. New modules are added here. */
export const router = Router();

router.use("/health", healthRoutes);

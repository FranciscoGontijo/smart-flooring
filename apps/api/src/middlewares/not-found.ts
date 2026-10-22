import type { RequestHandler } from "express";
import { AppError } from "../lib/errors.js";

export const notFound: RequestHandler = () => {
  throw new AppError("ROUTE_NOT_FOUND");
};

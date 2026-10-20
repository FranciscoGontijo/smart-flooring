import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import type { Logger } from "pino";
import { pinoHttp } from "pino-http";
import { naoEncontrado, tratarErros } from "./http/erros.js";
import { rotasHealth } from "./rotas/health.js";

export interface DependenciasApp {
  logger: Logger;
  webUrl: string;
  verificarBanco: () => Promise<void>;
}

export function criarApp({ logger, webUrl, verificarBanco }: DependenciasApp): Express {
  const app = express();

  app.disable("x-powered-by");
  app.use(helmet());
  app.use(cors({ origin: webUrl, credentials: true }));
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());
  app.use(pinoHttp({ logger }));

  app.use(rotasHealth(verificarBanco));

  app.use(naoEncontrado);
  app.use(tratarErros);

  return app;
}

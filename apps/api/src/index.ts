import { criarApp } from "./app.js";
import { carregarEnv } from "./config/env.js";
import { criarPrisma } from "./db.js";
import { criarLogger } from "./logger.js";

const env = carregarEnv();
const logger = criarLogger(env);
const prisma = criarPrisma(env.DATABASE_URL);

const app = criarApp({
  logger,
  webUrl: env.WEB_URL,
  verificarBanco: async () => {
    await prisma.$queryRaw`SELECT 1`;
  },
});

const servidor = app.listen(env.PORT, () => {
  logger.info(`API ouvindo em http://localhost:${env.PORT}`);
});

async function encerrar(sinal: string) {
  logger.info(`${sinal} recebido, encerrando`);
  servidor.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", () => void encerrar("SIGINT"));
process.on("SIGTERM", () => void encerrar("SIGTERM"));

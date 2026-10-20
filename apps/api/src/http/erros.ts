import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";

/** An error with an HTTP status and a message that is safe to show to the client. */
export class ErroHttp extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ErroHttp";
  }
}

export const naoEncontrado: RequestHandler = (_req, res) => {
  res.status(404).json({ erro: "Rota não encontrada." });
};

export const tratarErros: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ erro: "Dados inválidos.", detalhes: err.issues });
    return;
  }
  if (err instanceof ErroHttp) {
    res.status(err.status).json({ erro: err.message });
    return;
  }
  req.log.error({ err }, "erro não tratado");
  res.status(500).json({ erro: "Erro interno." });
};

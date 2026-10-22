/**
 * Single catalog of API errors: a stable code (the front end decides by it), the HTTP status
 * and the default message shown to the user. `satisfies` rejects a code without a status.
 * Messages are in Portuguese because they reach the user.
 */
export const ERROR_CATALOG = {
  BAD_REQUEST: { status: 400, message: "Requisição inválida." },
  MALFORMED_JSON: { status: 400, message: "O corpo da requisição não é um JSON válido." },
  INVALID_ID: { status: 400, message: "O ID informado não é válido." },
  UNAUTHENTICATED: { status: 401, message: "Você precisa estar autenticado." },
  ACCOUNT_NOT_ACTIVE: { status: 403, message: "Sua conta não está ativa." },
  FORBIDDEN: { status: 403, message: "Você não tem permissão para esta ação." },
  ROUTE_NOT_FOUND: { status: 404, message: "Rota não encontrada." },
  CONCURRENT_MODIFICATION: {
    status: 409,
    message: "Conflito com outra alteração simultânea. Tente novamente.",
  },
  PAYLOAD_TOO_LARGE: { status: 413, message: "O corpo da requisição é grande demais." },
  VALIDATION_ERROR: { status: 422, message: "Alguns campos são inválidos." },
  RATE_LIMITED: { status: 429, message: "Muitas requisições. Aguarde um pouco." },
  INTERNAL_ERROR: { status: 500, message: "Erro interno. Tente novamente mais tarde." },
  SERVICE_UNAVAILABLE: {
    status: 503,
    message: "Serviço temporariamente indisponível. Tente novamente.",
  },
} as const satisfies Record<string, { status: number; message: string }>;

export type ErrorCode = keyof typeof ERROR_CATALOG;

export type FieldError = { field: string; message: string };

/** An expected application error. Anything that isn't an AppError becomes a 500. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly details: FieldError[] | undefined;

  constructor(
    code: ErrorCode,
    options: { message?: string; details?: FieldError[]; cause?: unknown } = {},
  ) {
    super(options.message ?? ERROR_CATALOG[code].message, { cause: options.cause });
    this.name = "AppError";
    this.code = code;
    this.status = ERROR_CATALOG[code].status;
    this.details = options.details;
  }
}

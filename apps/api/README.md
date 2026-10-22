# @smart-flooring/api

Express API. Everything the front end does goes through it: auth (own JWT), business rules,
jobs, AI (Claude), images, PDF/DOCX and e-mail. Supabase is used only as Postgres + Storage,
from the server. See `docs/definicao-do-projeto.md`, section 5.

```bash
cp .env.example .env
pnpm db:up                                  # from the repo root: local Postgres
pnpm --filter @smart-flooring/api db:migrate
pnpm --filter @smart-flooring/api dev       # http://localhost:4000/health
```

## Structure

```
src/
  server.ts            starts the HTTP server and shuts down cleanly
  app.ts               createApp(): global middlewares, router, 404, error handler
  router.ts            mounts each module under its path
  config/env.ts        environment variables, validated at startup
  lib/                 infrastructure shared by modules
    prisma.ts          Prisma client (with connection and query timeouts)
    prisma-errors.ts   db() wrapper + translation of Prisma errors
    errors.ts          error catalog (code, status, Portuguese message) and AppError
    validation.ts      zod → VALIDATION_ERROR
    logger.ts          pino
  middlewares/         request-id, validate, not-found, error-handler (later: auth)
  modules/<feature>/   one folder per feature
    <feature>.routes.ts       paths + middlewares (validation, auth) → controller
    <feature>.controller.ts   reads the request, calls the service, writes the response
    <feature>.service.ts      business rules; throws AppError; knows nothing about Express
    <feature>.repository.ts   the only layer that touches Prisma; every call goes through db()
    <feature>.schema.ts       zod schemas of the requests (or re-exports from @smart-flooring/shared)
    <feature>.test.ts         supertest on createApp(), with the repository mocked
  types/express.d.ts   Request augmentation (requestId; later the authenticated user)
  generated/           Prisma client (generated, not committed)
```

## Conventions

- **Code in English, messages to the user in Portuguese** (`lib/errors.ts`).
- **Errors:** services throw `AppError("CODE")` from the catalog. Anything else becomes a 500.
  Every error response is `{ error: { code, message, details?, requestId } }`; the front end
  decides by `code`.
- **No try/catch in controllers:** Express 5 forwards rejected promises to the error handler.
- **Validation:** `validateBody(schema)` in the route. Schemas the web app also uses live in
  `packages/shared`.
- **Database:** only repositories import `prisma`, always inside `db(() => ...)`, so no raw
  Prisma error reaches a service.
- **Tests:** next to the code (`*.test.ts`), with Vitest + supertest; repositories are mocked
  with `vi.mock`, so tests don't need a database.

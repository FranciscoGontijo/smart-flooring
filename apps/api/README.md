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

- Logic lives in modules that don't depend on Express; routes only validate, authorize and call them.
- Prisma schema and migrations: `prisma/`. The generated client goes to `src/generated/` (not committed).

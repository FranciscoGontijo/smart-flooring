# Smart Flooring

Platform for Smart Flooring: from the lead to the installation, with AI-generated inspection
documents. The product definition (in Portuguese) is in
[`docs/definicao-do-projeto.md`](docs/definicao-do-projeto.md).

## Structure

```
apps/
  web/        Next.js + shadcn/ui: inspector (mobile first), project manager and admin
  api/        Express + Prisma: auth (own JWT), rules, jobs, AI, documents, e-mail
packages/
  shared/     zod schemas and types shared by web and api
docs/         product definition
```

The web app talks only to the API. Supabase is used as Postgres + Storage, from the API only.

## Requirements

- Node 24 (`.nvmrc`)
- pnpm 12
- Docker (local Postgres)

## Getting started

```bash
pnpm install
pnpm db:up                                   # Postgres on localhost:5433
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm --filter @smart-flooring/api db:migrate
pnpm dev                                     # web :3000, api :4000
```

## Scripts

| Command                       | What it does             |
| ----------------------------- | ------------------------ |
| `pnpm dev`                    | All apps in watch mode   |
| `pnpm check`                  | lint + typecheck + tests |
| `pnpm build`                  | Builds every package     |
| `pnpm format`                 | Prettier                 |
| `pnpm db:up` / `pnpm db:down` | Local Postgres           |

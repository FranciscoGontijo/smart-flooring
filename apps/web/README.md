# @smart-flooring/web

Next.js front end: the inspector screens (mobile first), the project manager and the admin.
It talks only to `apps/api`; it never calls Supabase directly (see `docs/definicao-do-projeto.md`, section 5).

```bash
cp .env.example .env.local
pnpm --filter @smart-flooring/web dev
```

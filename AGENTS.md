# Smart Flooring monorepo

- Product definition and decisions: `docs/definicao-do-projeto.md`. Read it before building a feature.
- pnpm workspaces + Turborepo. Run tasks from the root (`pnpm check`, `pnpm build`).
- `apps/web` (Next.js) talks only to `apps/api`. Never call Supabase from the web app.
- **Code in English** (identifiers, files, DB columns, enum values); **user-facing messages in
  Portuguese**. The product doc is in Portuguese; its section 6 names map to English in code.
- `apps/api` (Express): one folder per feature in `src/modules/<feature>/` with
  `<feature>.routes.ts` → `.controller.ts` → `.service.ts` → `.repository.ts` (+ `.schema.ts`,
  `.test.ts`). See `apps/api/README.md`. Prisma schema in `apps/api/prisma/`.
- `packages/shared`: zod schemas used by both sides. It is built to `dist/`, so rebuild it
  (`pnpm --filter @smart-flooring/shared build`, or `pnpm dev`) after changing it.
- `apps/web/AGENTS.md` has rules specific to this Next.js version.

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->

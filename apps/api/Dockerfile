# Build from the repo root:  docker build -f apps/api/Dockerfile .
FROM node:24-slim AS base
RUN corepack enable
WORKDIR /repo

FROM base AS build
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@smart-flooring/api
RUN pnpm deploy --filter=@smart-flooring/api --prod --legacy /app

FROM node:24-slim AS runtime
# LibreOffice (DOCX -> PDF) will be added here when document generation lands.
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app .
COPY --from=build /repo/apps/api/dist ./dist
USER node
EXPOSE 4000
CMD ["node", "dist/index.js"]

-- CreateEnum
CREATE TYPE "Papel" AS ENUM ('inspetor', 'pm', 'admin');

-- CreateEnum
CREATE TYPE "Idioma" AS ENUM ('pt', 'en');

-- CreateEnum
CREATE TYPE "TipoTokenConvite" AS ENUM ('convite', 'redefinir_senha');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT,
    "papel" "Papel" NOT NULL,
    "idioma" "Idioma" NOT NULL DEFAULT 'pt',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessoes" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "refresh_hash" TEXT NOT NULL,
    "expira_em" TIMESTAMPTZ NOT NULL,
    "revogada_em" TIMESTAMPTZ,
    "criada_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tokens_convite" (
    "id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "tipo" "TipoTokenConvite" NOT NULL,
    "token_hash" TEXT NOT NULL,
    "expira_em" TIMESTAMPTZ NOT NULL,
    "usado_em" TIMESTAMPTZ,
    "criado_em" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tokens_convite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "sessoes_refresh_hash_key" ON "sessoes"("refresh_hash");

-- CreateIndex
CREATE INDEX "sessoes_usuario_id_idx" ON "sessoes"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "tokens_convite_token_hash_key" ON "tokens_convite"("token_hash");

-- CreateIndex
CREATE INDEX "tokens_convite_usuario_id_idx" ON "tokens_convite"("usuario_id");

-- AddForeignKey
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tokens_convite" ADD CONSTRAINT "tokens_convite_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

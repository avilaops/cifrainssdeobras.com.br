CREATE TYPE "StatusSimulacao" AS ENUM ('RASCUNHO', 'SIMULADO', 'PROPOSTA_ENVIADA', 'CONTRATADO', 'EM_REGULARIZACAO', 'CONCLUIDO', 'CANCELADO');
CREATE TYPE "TipoAuditoria" AS ENUM ('CRIACAO', 'EDICAO', 'EXCLUSAO', 'RELATORIO_EMITIDO', 'STATUS_ALTERADO');

CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "nome" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "documento" TEXT,
    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "obras" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "nome" TEXT,
    "uf" TEXT NOT NULL,
    "tipoObra" "TipoObra" NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "obras_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "auditorias" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "simulacaoId" TEXT,
    "tipo" "TipoAuditoria" NOT NULL,
    "usuario" TEXT NOT NULL,
    "detalhes" TEXT,
    CONSTRAINT "auditorias_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "simulacoes" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "clienteId" TEXT,
ADD COLUMN "obraId" TEXT,
ADD COLUMN "status" "StatusSimulacao" NOT NULL DEFAULT 'SIMULADO',
ADD COLUMN "versao" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN "versaoAnteriorId" TEXT,
ADD COLUMN "versaoCalculo" TEXT NOT NULL DEFAULT '2026.07',
ADD COLUMN "fonteParametros" TEXT NOT NULL DEFAULT 'IN RFB 2.021/2021 e Manual SERO',
ADD COLUMN "competenciaVau" TEXT,
ADD COLUMN "observacoes" TEXT,
ADD COLUMN "criadoPor" TEXT NOT NULL DEFAULT 'sistema';

CREATE UNIQUE INDEX "clientes_telefone_key" ON "clientes"("telefone");
CREATE UNIQUE INDEX "clientes_email_key" ON "clientes"("email");
CREATE INDEX "obras_clienteId_idx" ON "obras"("clienteId");
CREATE INDEX "simulacoes_clienteId_idx" ON "simulacoes"("clienteId");
CREATE INDEX "simulacoes_obraId_idx" ON "simulacoes"("obraId");
CREATE INDEX "simulacoes_status_idx" ON "simulacoes"("status");
CREATE INDEX "simulacoes_createdAt_idx" ON "simulacoes"("createdAt");
CREATE INDEX "auditorias_simulacaoId_idx" ON "auditorias"("simulacaoId");
CREATE INDEX "auditorias_createdAt_idx" ON "auditorias"("createdAt");

ALTER TABLE "obras" ADD CONSTRAINT "obras_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "simulacoes" ADD CONSTRAINT "simulacoes_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "simulacoes" ADD CONSTRAINT "simulacoes_obraId_fkey" FOREIGN KEY ("obraId") REFERENCES "obras"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "simulacoes" ADD CONSTRAINT "simulacoes_versaoAnteriorId_fkey" FOREIGN KEY ("versaoAnteriorId") REFERENCES "simulacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "auditorias" ADD CONSTRAINT "auditorias_simulacaoId_fkey" FOREIGN KEY ("simulacaoId") REFERENCES "simulacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

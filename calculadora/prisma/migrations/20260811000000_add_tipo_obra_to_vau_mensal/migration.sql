-- CreateEnum
CREATE TYPE "TipoObraVau" AS ENUM ('CASA_POPULAR', 'COMERCIAL_SALAS_LOJAS', 'CONJUNTO_HABITACIONAL_POPULAR', 'EDIFICIO_GARAGENS', 'GALPAO_INDUSTRIAL', 'RESIDENCIAL_MULTIFAMILIAR', 'RESIDENCIAL_UNIFAMILIAR');

-- AlterTable: add as nullable first, backfill, then enforce NOT NULL
ALTER TABLE "vau_mensal" ADD COLUMN "tipoObra" "TipoObraVau";

UPDATE "vau_mensal" SET "tipoObra" = 'RESIDENCIAL_UNIFAMILIAR' WHERE "tipoObra" IS NULL;

ALTER TABLE "vau_mensal" ALTER COLUMN "tipoObra" SET NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "vau_mensal_uf_competencia_key";

-- CreateIndex
CREATE UNIQUE INDEX "vau_mensal_uf_competencia_tipoObra_key" ON "vau_mensal"("uf", "competencia", "tipoObra");

-- CreateEnum
CREATE TYPE "Responsavel" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "TipoObra" AS ENUM ('RESIDENCIAL', 'MULTIFAMILIAR', 'COMERCIAL', 'INDUSTRIAL', 'REFORMA', 'DEMOLICAO', 'PISCINA', 'MISTA');

-- CreateTable
CREATE TABLE "simulacoes" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "nomeCliente" TEXT NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "responsavel" "Responsavel" NOT NULL,
    "uf" TEXT NOT NULL,
    "tipoObra" "TipoObra" NOT NULL,
    "areaConstrucao" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "areaReforma" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "areaPiscina" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "concretoUsinado" BOOLEAN NOT NULL DEFAULT false,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "vauManual" DOUBLE PRECISION,
    "percHonorarios" DOUBLE PRECISION NOT NULL DEFAULT 0.30,
    "vauUsado" DOUBLE PRECISION NOT NULL,
    "areaTotal" DOUBLE PRECISION NOT NULL,
    "codTotal" DOUBLE PRECISION NOT NULL,
    "rmtTotal" DOUBLE PRECISION NOT NULL,
    "fatorSocial" DOUBLE PRECISION NOT NULL,
    "inssBruto" DOUBLE PRECISION NOT NULL,
    "inssDevido" DOUBLE PRECISION NOT NULL,
    "podeFatorAjuste" BOOLEAN NOT NULL,
    "reducaoPercent" DOUBLE PRECISION NOT NULL,
    "inssComReducao" DOUBLE PRECISION NOT NULL,
    "economiaImposto" DOUBLE PRECISION NOT NULL,
    "honorarios" DOUBLE PRECISION NOT NULL,
    "economiaLiquida" DOUBLE PRECISION NOT NULL,
    "retroativo" DOUBLE PRECISION NOT NULL,
    "futuro" DOUBLE PRECISION NOT NULL,
    "mesesFuturos" INTEGER NOT NULL,
    "parcelaMensal" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "simulacoes_pkey" PRIMARY KEY ("id")
);

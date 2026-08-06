import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding data...');

  // 1. ParametrosImpostos
  await prisma.parametrosImpostos.upsert({
    where: { competencia: '2026' },
    update: {},
    create: {
      competencia: '2026',
      percentualUsinado: 0.05,
      preMoldadoMenor40: 0.0,
      preMoldadoMaior40: 0.0,
    },
  });
  console.log('ParametrosImpostos criados/atualizados.');

  // 2. RegraReducaoIRPF
  // Apagar regras de 2026 antes de inserir para evitar duplicação
  await prisma.regraReducaoIRPF.deleteMany({ where: { competencia: '2026' } });
  await prisma.regraReducaoIRPF.createMany({
    data: [
      { competencia: '2026', minPercentDctfweb: 0.5, reducaoPercent: 0.5 },
      { competencia: '2026', minPercentDctfweb: 0.7, reducaoPercent: 0.5 },
    ],
  });
  console.log('RegraReducaoIRPF criadas/atualizadas.');

  // 3. TabelaINSS (2026 based on dados.ts)
  await prisma.tabelaINSS.deleteMany({ where: { competencia: '2026' } });
  await prisma.tabelaINSS.createMany({
    data: [
      { competencia: '2026', limite: 1412.0, aliquota: 0.075, deducao: 0.0 },
      { competencia: '2026', limite: 2666.68, aliquota: 0.09, deducao: 21.18 },
      { competencia: '2026', limite: 4000.03, aliquota: 0.12, deducao: 101.18 },
      { competencia: '2026', limite: 7786.02, aliquota: 0.14, deducao: 181.18 },
    ],
  });
  console.log('TabelaINSS criadas/atualizadas.');

  // 4. TabelaIRPF (2026 based on dados.ts)
  await prisma.tabelaIRPF.deleteMany({ where: { competencia: '2026' } });
  await prisma.tabelaIRPF.createMany({
    data: [
      { competencia: '2026', limite: 2259.2, aliquota: 0.0, deducao: 0.0 },
      { competencia: '2026', limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
      { competencia: '2026', limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
      { competencia: '2026', limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
      { competencia: '2026', limite: 99999999.0, aliquota: 0.275, deducao: 896.0 },
    ],
  });
  console.log('TabelaIRPF criadas/atualizadas.');

  console.log('Seeding concluído!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

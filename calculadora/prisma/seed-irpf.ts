import { prisma } from '../src/lib/prisma';

async function main() {
  console.log('Seed IRPF/INSS finalizado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

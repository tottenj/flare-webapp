import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);
  // ... rest of your seed
}
main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

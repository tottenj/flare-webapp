import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);


  // --- Seed Users ---
  const userEmailVerified = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      id: '1',
      firebaseUid: 'user1',
      email: 'user@gmail.com',
      emailVerified: true
    },
  });
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

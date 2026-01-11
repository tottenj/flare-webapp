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
      firebaseUid: 'uid1',
      email: 'user@gmail.com',
      status: "ACTIVE"
    },
  });

  const userEmailVerified2Pending = await prisma.user.upsert({
    where: { email: 'userEmailVerified2@gmail.com' },
    update: {},
    create: {
      id: '1.5',
      firebaseUid: 'uid1.5',
      email: 'userEmailVerified2@gmail.com',
      status: "PENDING"
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

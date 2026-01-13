import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // --- Seed Location ---
  const locationRows = await prisma.$queryRaw(
    Prisma.sql`
    INSERT INTO "Location" ("id", "placeId", "point")
    VALUES (
      gen_random_uuid(),
      'test-place-id-1',
      ST_SetSRID(ST_MakePoint(-79.3832, 43.6532), 4326)
    )
    RETURNING "id";
  `
  );

  if (!locationRows.length) {
    throw new Error('Failed to seed Location');
  }

  const locationId = locationRows[0].id;

  // --- Seed Users ---
  const userEmailVerified = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      id: '1',
      firebaseUid: 'uid1',
      email: 'user@gmail.com',
      status: 'ACTIVE',
    },
  });

  const userEmailVerified2Pending = await prisma.user.upsert({
    where: { email: 'userEmailVerified2@gmail.com' },
    update: {},
    create: {
      id: '1.5',
      firebaseUid: 'uid1.5',
      email: 'userEmailVerified2@gmail.com',
      status: 'PENDING',
    },
  });

  const unverifiedOrg = await prisma.user.upsert({
    where: { email: 'unverifiedOrg@gmail.com' },
    update: {},
    create: {
      id: '3',
      firebaseUid: 'uid3',
      email: 'unverifiedOrg@gmail.com',
      status: 'ACTIVE',

      organizationProfile: {
        create: {
          orgName: 'unverifiedOrg',
          status: 'PENDING',
          location: {
            connect: { id: locationId }, // ✅ correct
          },
        },
      },
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

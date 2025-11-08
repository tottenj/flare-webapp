import { PrismaClient } from '../src/app/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  // Ensure PostGIS is enabled
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // --- Seed Location ---
  await prisma.$executeRawUnsafe(`
    INSERT INTO "location" (id, place_id, name, coordinates)
    VALUES (
      'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
      'ChIJK4J5p5RzK4gRL6c1pFiP7Tw',
      'Toronto Pearson International Airport',
      ST_SetSRID(ST_MakePoint(-79.62482, 43.67772), 4326)::geography
    )
    ON CONFLICT (place_id)
    DO UPDATE
    SET name = EXCLUDED.name;
  `);

  // Fetch location to use for foreign key relationships
  const location1 = await prisma.location.findUnique({
    where: { place_id: 'ChIJK4J5p5RzK4gRL6c1pFiP7Tw' },
  });

  // --- Seed Users ---
  const user1 = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      id: "user1",
      email: 'user@gmail.com',
      account_type: 'user',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'unverifiedOrg@gmail.com' },
    update: {},
    create: {
      id: "org1",
      email: 'unverifiedOrg@gmail.com',
      account_type: 'org',
    },
  });

  const user3 = await prisma.user.upsert({
    where: { email: 'verifiedOrg@gmail.com' },
    update: {},
    create: {
      id: "org2",
      email: 'verifiedOrg@gmail.com',
      account_type: 'org',
    },
  });

  // --- Seed FlareUser ---
  await prisma.flareUser.upsert({
    where: { user_id: user1.id },
    update: {},
    create: {
      user: { connect: { id: user1.id } },
    },
  });

  // --- Seed FlareOrgs ---
  await prisma.flareOrg.upsert({
    where: { user_id: user2.id },
    update: {},
    create: {
      user: { connect: { id: user2.id } },
      location: { connect: { id: location1.id } },
      
    },
  });

  await prisma.flareOrg.upsert({
    where: { user_id: user3.id },
    update: {},
    create: {
      user: { connect: { id: user3.id } },
      location: { connect: { id: location1.id } },
      verified: true,
    },
  });

  console.log('✅ Seed data inserted successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

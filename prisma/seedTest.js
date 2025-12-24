import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Ensure PostGIS is enabled
  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  /*
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

  */

  // --- Seed Users ---
  const user1 = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      id: 'user1',
      firebaseUid: 'uid123',
      email: 'user@gmail.com',
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

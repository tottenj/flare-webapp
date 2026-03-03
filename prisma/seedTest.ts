import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function seedTest(prisma: PrismaClient) {
  function futureDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
  }

  function pastDate(days: number) {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d;
  }

  await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);

  // --- Seed Location ---
  const locationRows: any = await prisma.$queryRaw(
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
          id: 'org1',
          orgName: 'unverifiedOrg',
          status: 'PENDING',
          location: {
            connect: { id: locationId }, // ✅ correct
          },
        },
      },
    },
  });

  const unverifiedOrgProfileId = await prisma.organizationProfile.findUnique({
    where: { id: 'org1' },
    select: { id: true },
  });

  //Image Assets
  const stockEvent = await prisma.imageAsset.upsert({
    where: { id: 'stockEvent' },
    update: {},
    create: {
      id: 'stockEvent',
      storagePath: 'events/uid3/randoCrypto/stockEvent.jpg',
    },
  });

  const tag1 = await prisma.tag.upsert({
    where: { id: 'tag1' },
    update: {},
    create: {
      id: 'tag1',
      label: 'tag1',
      usageCount: 1,
    },
  });

  const tag2 = await prisma.tag.upsert({
    where: { id: 'tag2' },
    update: {},
    create: {
      id: 'tag2',
      label: 'tag2',
      usageCount: 1,
    },
  });

  const tag3 = await prisma.tag.upsert({
    where: { id: 'tag3' },
    update: {},
    create: {
      id: 'tag3',
      label: 'tag3',
      usageCount: 1,
    },
  });

  //Events
  // --- Events ---

  // 1️⃣ Upcoming Published Event
  await prisma.flareEvent.upsert({
    where: { id: 'eventUpcoming' },
    update: {},
    create: {
      id: 'eventUpcoming',
      organizationId: unverifiedOrgProfileId!.id,
      status: 'PUBLISHED',
      title: 'Upcoming Event',
      description: 'Future published event',
      imageId: stockEvent.id,
      startsAtUTC: futureDate(5),
      timezone: 'America/Toronto',
      locationId: locationId,
      pricingType: 'FREE',
    },
  });

  // 2️⃣ Past Published Event
  await prisma.flareEvent.upsert({
    where: { id: 'eventPast' },
    update: {},
    create: {
      id: 'eventPast',
      organizationId: unverifiedOrgProfileId!.id,
      status: 'PUBLISHED',
      title: 'Past Event',
      description: 'Past published event',
      imageId: stockEvent.id,
      startsAtUTC: pastDate(5),
      timezone: 'America/Toronto',
      locationId: locationId,
      pricingType: 'FREE',
    },
  });

  // 3️⃣ Draft Event (future date but not visible)
  await prisma.flareEvent.upsert({
    where: { id: 'eventDraft' },
    update: {},
    create: {
      id: 'eventDraft',
      organizationId: unverifiedOrgProfileId!.id,
      status: 'DRAFT',
      title: 'Draft Event',
      description: 'Draft future event',
      imageId: stockEvent.id,
      startsAtUTC: futureDate(10),
      timezone: 'America/Toronto',
      locationId: locationId,
      pricingType: 'FREE',
    },
  });

  // 4️⃣ Another Published Event (for list sorting tests)
  await prisma.flareEvent.upsert({
    where: { id: 'eventPublished' },
    update: {},
    create: {
      id: 'eventPublished',
      organizationId: unverifiedOrgProfileId!.id,
      status: 'PUBLISHED',
      title: 'Another Published Event',
      description: 'Another future published event',
      imageId: stockEvent.id,
      startsAtUTC: futureDate(15),
      timezone: 'America/Toronto',
      locationId: locationId,
      pricingType: 'FREE',
    },
  });
}


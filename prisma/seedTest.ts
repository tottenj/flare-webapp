import 'dotenv/config';
import { Prisma, PrismaClient } from './generated/client';
import {
  SEEDED_TEST_EVENTS,
  SEEDED_TEST_IMAGES,
  SEEDED_TEST_LOCATIONS,
  SEEDED_TEST_ORGS,
  SEEDED_TEST_TAGS,
  SEEDED_TEST_USERS,
} from './seedTest.constants';

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
  await prisma.$queryRaw(
    Prisma.sql`
    INSERT INTO "Location" ("id", "placeId", "address", "point")
    VALUES (
      ${SEEDED_TEST_LOCATIONS.primary.id},
      ${SEEDED_TEST_LOCATIONS.primary.placeId},
      ${SEEDED_TEST_LOCATIONS.primary.address},
      ST_SetSRID(
        ST_MakePoint(${SEEDED_TEST_LOCATIONS.primary.lng}, ${SEEDED_TEST_LOCATIONS.primary.lat}),
        4326
      )
    )
    ON CONFLICT ("placeId")
    DO UPDATE SET
      address = EXCLUDED.address;
  `
  );

  await prisma.$queryRaw(
    Prisma.sql`
    INSERT INTO "Location" ("id", "placeId", "address", "point")
    VALUES (
      ${SEEDED_TEST_LOCATIONS.editableEvent.id},
      ${SEEDED_TEST_LOCATIONS.editableEvent.placeId},
      ${SEEDED_TEST_LOCATIONS.editableEvent.address},
      ST_SetSRID(
        ST_MakePoint(${SEEDED_TEST_LOCATIONS.editableEvent.lng}, ${SEEDED_TEST_LOCATIONS.editableEvent.lat}),
        4326
      )
    )
    ON CONFLICT ("placeId")
    DO UPDATE SET
      address = EXCLUDED.address;
  `
  );

  // --- Seed Users ---
  const userEmailVerified = await prisma.user.upsert({
    where: { email: SEEDED_TEST_USERS.activeUser.email },
    update: {},
    create: {
      id: SEEDED_TEST_USERS.activeUser.id,
      firebaseUid: SEEDED_TEST_USERS.activeUser.firebaseUid,
      email: SEEDED_TEST_USERS.activeUser.email,
      status: SEEDED_TEST_USERS.activeUser.status,
      role: SEEDED_TEST_USERS.activeUser.role,
    },
  });

  const userEmailVerified2Pending = await prisma.user.upsert({
    where: { email: SEEDED_TEST_USERS.pendingEmailVerifiedUser.email },
    update: {},
    create: {
      id: SEEDED_TEST_USERS.pendingEmailVerifiedUser.id,
      firebaseUid: SEEDED_TEST_USERS.pendingEmailVerifiedUser.firebaseUid,
      email: SEEDED_TEST_USERS.pendingEmailVerifiedUser.email,
      status: SEEDED_TEST_USERS.pendingEmailVerifiedUser.status,
      role: SEEDED_TEST_USERS.pendingEmailVerifiedUser.role,
    },
  });

  const unverifiedOrg = await prisma.user.upsert({
    where: { email: SEEDED_TEST_USERS.pendingOrgUser.email },
    update: {},
    create: {
      id: SEEDED_TEST_USERS.pendingOrgUser.id,
      firebaseUid: SEEDED_TEST_USERS.pendingOrgUser.firebaseUid,
      email: SEEDED_TEST_USERS.pendingOrgUser.email,
      status: SEEDED_TEST_USERS.pendingOrgUser.status,
      role: SEEDED_TEST_USERS.pendingOrgUser.role,

      organizationProfile: {
        create: {
          id: SEEDED_TEST_ORGS.pendingOrg.id,
          orgName: SEEDED_TEST_ORGS.pendingOrg.orgName,
          status: SEEDED_TEST_ORGS.pendingOrg.status,
          location: {
            connect: { id: SEEDED_TEST_LOCATIONS.primary.id },
          },
        },
      },
    },
  });

  const verifiedOrg = await prisma.user.upsert({
    where: { email: SEEDED_TEST_USERS.verifiedOrgUser.email },
    update: {},
    create: {
      id: SEEDED_TEST_USERS.verifiedOrgUser.id,
      firebaseUid: SEEDED_TEST_USERS.verifiedOrgUser.firebaseUid,
      email: SEEDED_TEST_USERS.verifiedOrgUser.email,
      status: SEEDED_TEST_USERS.verifiedOrgUser.status,
      role: SEEDED_TEST_USERS.verifiedOrgUser.role,

      organizationProfile: {
        create: {
          id: SEEDED_TEST_ORGS.verifiedOrg.id,
          orgName: SEEDED_TEST_ORGS.verifiedOrg.orgName,
          status: SEEDED_TEST_ORGS.verifiedOrg.status,
          location: {
            connect: { id: SEEDED_TEST_LOCATIONS.primary.id },
          },
        },
      },
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: SEEDED_TEST_USERS.adminUser.email },
    update: {},
    create: {
      id: SEEDED_TEST_USERS.adminUser.id,
      firebaseUid: SEEDED_TEST_USERS.adminUser.firebaseUid,
      email: SEEDED_TEST_USERS.adminUser.email,
      status: SEEDED_TEST_USERS.adminUser.status,
      role: SEEDED_TEST_USERS.adminUser.role,
    },
  });

  const unverifiedOrgProfileId = await prisma.organizationProfile.findUnique({
    where: { id: SEEDED_TEST_ORGS.pendingOrg.id },
    select: { id: true },
  });

  const verifiedOrgProfileId = await prisma.organizationProfile.findUnique({
    where: { id: SEEDED_TEST_ORGS.verifiedOrg.id },
    select: { id: true },
  });

  //Image Assets
  const stockEvent = await prisma.imageAsset.upsert({
    where: { id: SEEDED_TEST_IMAGES.sharedEvent.id },
    update: {},
    create: {
      id: SEEDED_TEST_IMAGES.sharedEvent.id,
      storagePath: SEEDED_TEST_IMAGES.sharedEvent.storagePath,
      contentType: SEEDED_TEST_IMAGES.sharedEvent.contentType,
      sizeBytes: SEEDED_TEST_IMAGES.sharedEvent.sizeBytes,
      originalName: SEEDED_TEST_IMAGES.sharedEvent.originalName,
    },
  });

  const editableEventImage = await prisma.imageAsset.upsert({
    where: { id: SEEDED_TEST_IMAGES.editableEvent.id },
    update: {},
    create: {
      id: SEEDED_TEST_IMAGES.editableEvent.id,
      storagePath: SEEDED_TEST_IMAGES.editableEvent.storagePath,
      contentType: SEEDED_TEST_IMAGES.editableEvent.contentType,
      sizeBytes: SEEDED_TEST_IMAGES.editableEvent.sizeBytes,
      originalName: SEEDED_TEST_IMAGES.editableEvent.originalName,
    },
  });

  const tag1 = await prisma.tag.upsert({
    where: { id: SEEDED_TEST_TAGS.genericOne.id },
    update: {},
    create: {
      id: SEEDED_TEST_TAGS.genericOne.id,
      label: SEEDED_TEST_TAGS.genericOne.label,
      usageCount: SEEDED_TEST_TAGS.genericOne.usageCount,
    },
  });

  const tag2 = await prisma.tag.upsert({
    where: { id: SEEDED_TEST_TAGS.genericTwo.id },
    update: {},
    create: {
      id: SEEDED_TEST_TAGS.genericTwo.id,
      label: SEEDED_TEST_TAGS.genericTwo.label,
      usageCount: SEEDED_TEST_TAGS.genericTwo.usageCount,
    },
  });

  const tag3 = await prisma.tag.upsert({
    where: { id: SEEDED_TEST_TAGS.genericThree.id },
    update: {},
    create: {
      id: SEEDED_TEST_TAGS.genericThree.id,
      label: SEEDED_TEST_TAGS.genericThree.label,
      usageCount: SEEDED_TEST_TAGS.genericThree.usageCount,
    },
  });

  const editableTagDrag = await prisma.tag.upsert({
    where: { id: SEEDED_TEST_TAGS.editableDrag.id },
    update: {},
    create: {
      id: SEEDED_TEST_TAGS.editableDrag.id,
      label: SEEDED_TEST_TAGS.editableDrag.label,
      usageCount: SEEDED_TEST_TAGS.editableDrag.usageCount,
    },
  });

  const editableTagCommunity = await prisma.tag.upsert({
    where: { id: SEEDED_TEST_TAGS.editableCommunity.id },
    update: {},
    create: {
      id: SEEDED_TEST_TAGS.editableCommunity.id,
      label: SEEDED_TEST_TAGS.editableCommunity.label,
      usageCount: SEEDED_TEST_TAGS.editableCommunity.usageCount,
    },
  });

  //Events
  // --- Events ---

  // 1️⃣ Upcoming Published Event
  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.upcoming.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.upcoming.id,
      organizationId: unverifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.upcoming.status,
      title: SEEDED_TEST_EVENTS.upcoming.title,
      description: SEEDED_TEST_EVENTS.upcoming.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(5),
      timezone: SEEDED_TEST_EVENTS.upcoming.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  // 2️⃣ Past Published Event
  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.past.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.past.id,
      organizationId: unverifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.past.status,
      title: SEEDED_TEST_EVENTS.past.title,
      description: SEEDED_TEST_EVENTS.past.description,
      imageId: stockEvent.id,
      startsAtUTC: pastDate(5),
      timezone: SEEDED_TEST_EVENTS.past.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  // 3️⃣ Draft Event (future date but not visible)
  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.draft.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.draft.id,
      organizationId: unverifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.draft.status,
      title: SEEDED_TEST_EVENTS.draft.title,
      description: SEEDED_TEST_EVENTS.draft.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(10),
      timezone: SEEDED_TEST_EVENTS.draft.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  // 4️⃣ Another Published Event (for list sorting tests)
  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.published.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.published.id,
      organizationId: unverifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.published.status,
      title: SEEDED_TEST_EVENTS.published.title,
      description: SEEDED_TEST_EVENTS.published.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(15),
      timezone: SEEDED_TEST_EVENTS.published.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.editable.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.editable.id,
      organizationId: unverifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.editable.status,
      title: SEEDED_TEST_EVENTS.editable.title,
      description: SEEDED_TEST_EVENTS.editable.description,
      category: SEEDED_TEST_EVENTS.editable.category,
      ageRestriction: SEEDED_TEST_EVENTS.editable.ageRestriction,
      imageId: editableEventImage.id,
      startsAtUTC: new Date(SEEDED_TEST_EVENTS.editable.startsAtUTC),
      endsAtUTC: new Date(SEEDED_TEST_EVENTS.editable.endsAtUTC),
      timezone: SEEDED_TEST_EVENTS.editable.timezone,
      locationId: SEEDED_TEST_EVENTS.editable.location.id,
      pricingType: SEEDED_TEST_EVENTS.editable.pricingType,
      minPriceCents: SEEDED_TEST_EVENTS.editable.minPriceCents,
      maxPriceCents: SEEDED_TEST_EVENTS.editable.maxPriceCents,
      tags: {
        create: [
          { tag: { connect: { id: editableTagDrag.id } } },
          { tag: { connect: { id: editableTagCommunity.id } } },
        ],
      },
    },
  });

  // Verified org events
  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.verifiedUpcoming.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.verifiedUpcoming.id,
      organizationId: verifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.verifiedUpcoming.status,
      title: SEEDED_TEST_EVENTS.verifiedUpcoming.title,
      description: SEEDED_TEST_EVENTS.verifiedUpcoming.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(7),
      timezone: SEEDED_TEST_EVENTS.verifiedUpcoming.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.verifiedPublished.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.verifiedPublished.id,
      organizationId: verifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.verifiedPublished.status,
      title: SEEDED_TEST_EVENTS.verifiedPublished.title,
      description: SEEDED_TEST_EVENTS.verifiedPublished.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(20),
      timezone: SEEDED_TEST_EVENTS.verifiedPublished.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });

  await prisma.flareEvent.upsert({
    where: { id: SEEDED_TEST_EVENTS.verifiedDraft.id },
    update: {},
    create: {
      id: SEEDED_TEST_EVENTS.verifiedDraft.id,
      organizationId: verifiedOrgProfileId!.id,
      status: SEEDED_TEST_EVENTS.verifiedDraft.status,
      title: SEEDED_TEST_EVENTS.verifiedDraft.title,
      description: SEEDED_TEST_EVENTS.verifiedDraft.description,
      imageId: stockEvent.id,
      startsAtUTC: futureDate(30),
      timezone: SEEDED_TEST_EVENTS.verifiedDraft.timezone,
      locationId: SEEDED_TEST_LOCATIONS.primary.id,
      pricingType: 'FREE',
    },
  });
}

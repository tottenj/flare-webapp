import 'server-only';
import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';

import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { EventRow, eventRowInclude } from '@/lib/types/dto/event/EventDto';
import { UserEventFilter } from '@/lib/types/UserEventFilter';
import { Prisma } from '../../../../prisma/generated/client';

export class EventDal {
  async create(input: EventDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const { tags, ...rest } = input;
    await client.flareEvent.create({
      data: {
        ...rest,
        tags: {
          create: tags.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });
  }

  async getOwnerInfo(eventId: string) {
    return await prisma.flareEvent.findUnique({
      where: { id: eventId },
      select: {
        organizationId: true,
      },
    });
  }

  async getEvent(eventId: string): Promise<EventRow | null> {
    return await prisma.flareEvent.findUnique({
      where: { id: eventId },
      include: eventRowInclude,
    });
  }

  async getUpcomingOrgEvent(orgId: string) {
    return await prisma.flareEvent.findFirst({
      where: {
        organizationId: orgId,
        status: 'PUBLISHED',
        startsAtUTC: {
          gt: new Date(),
        },
      },
      orderBy: {
        startsAtUTC: 'asc',
      },
      include: eventRowInclude,
    });
  }

  async getEditData(eventId: string) {
    return await prisma.flareEvent.findUnique({
      where: { id: eventId },
      select: {
        image: true,
        locationId: true,
      },
    });
  }

  async listEventsUser(filters?: UserEventFilter, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;

    let nearbyEventIds: string[] | undefined;

    if (filters?.placeId && filters?.distance) {
      const radiusMeters = filters.distance * 1000;

      const rows = await client.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT e.id
      FROM "FlareEvent" e
      JOIN "Location" event_location ON event_location.id = e."locationId"
      JOIN "Location" search_location ON search_location."placeId" = ${filters.placeId}
      WHERE ST_DWithin(
        event_location.point,
        search_location.point,
        ${radiusMeters}
      )
    `);

      nearbyEventIds = rows.map((row) => row.id);

      if (nearbyEventIds.length === 0) {
        return [];
      }
    }

    return await client.flareEvent.findMany({
      where: {
        organization: { status: 'VERIFIED' },
        status: 'PUBLISHED',
        ...(filters?.category && {
          category: filters.category,
        }),
        ...(nearbyEventIds && {
          id: { in: nearbyEventIds },
        }),
      },
      orderBy: {
        startsAtUTC: 'asc',
      },
      include: eventRowInclude,
    });
  }

  async listEventsOrg(
    orgId: string,
    filters?: OrgEventFilter,
    tx?: Prisma.TransactionClient
  ): Promise<EventRow[]> {
    const client = tx ?? prisma;
    return await client.flareEvent.findMany({
      where: {
        organizationId: orgId,
        ...(filters && filters.status && { status: filters.status }),
      },
      orderBy: {
        startsAtUTC: 'asc',
      },
      include: eventRowInclude,
    });
  }

  async listSavedEvents(userId: string): Promise<EventRow[]> {
    return await prisma.flareEvent.findMany({
      where: {
        savedByUsers: {
          some: {
            userId,
          },
        },
      },
      include: eventRowInclude,
    });
  }

  async edit(eventId: string, input: EventDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const { tags, organizationId, ...rest } = input;

    return await client.flareEvent.update({
      where: { id: eventId },
      data: {
        ...rest,
        tags: {
          deleteMany: {},
          create: tags.map((tagId) => ({
            tag: { connect: { id: tagId } },
          })),
        },
      },
    });
  }

  async saveEvent(eventId: string, userId: string, save: boolean, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    if (save) {
      await client.savedEvent.upsert({
        where: {
          userId_eventId: {
            userId,
            eventId,
          },
        },
        update: {},
        create: {
          eventId,
          userId,
        },
      });
    } else {
      await client.savedEvent.deleteMany({
        where: {
          eventId,
          userId,
        },
      });
    }
  }

  async isSavedByUser(eventId: string, userId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const saved = await client.savedEvent.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
      select: {
        id: true,
      },
    });

    return Boolean(saved);
  }
}

export const eventDal = new EventDal();

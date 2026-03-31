import 'server-only';
import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';

import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { EventRow, eventRowInclude } from '@/lib/types/dto/EventDto';
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
    return await client.flareEvent.findMany({
      where: {
        organization: { status: 'VERIFIED' },
        status: 'PUBLISHED',
        ...(filters?.placeId && {
          location: {
            placeId: filters.placeId,
          },
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
}

export const eventDal = new EventDal();

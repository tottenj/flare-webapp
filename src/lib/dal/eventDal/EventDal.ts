import 'server-only';
import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { EventRow, eventRowInclude } from '@/lib/types/dto/EventDto';
import { UserEventFilter } from '@/lib/types/UserEventFilter';

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
}

export const eventDal = new EventDal();

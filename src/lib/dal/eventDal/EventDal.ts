import 'server-only';
import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { EventRow } from '@/lib/types/dto/EventDto';

export class EventDal {
  async create(input: EventDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.flareEvent.create({ data: input });
  }

  async listEventsOrg(orgId: string, filters?: OrgEventFilter, tx?: Prisma.TransactionClient): Promise<EventRow[]> {
    const client = tx ?? prisma;
    return await client.flareEvent.findMany({
      where: {
        organizationId: orgId,
        ...(filters && filters.status && { status: filters.status }),
      },
      orderBy: {
        startsAtUTC: 'asc',
      },
      include:{
        location:{
          select:{
            address:true,
            placeId:true
          }
        },
        image:{
          select:{
            storagePath: true
          }
        },
        organization:{
          select: {
            orgName: true
          }
        }
      }
    });
  }
}

export const eventDal = new EventDal();

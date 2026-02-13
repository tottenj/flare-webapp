import 'server-only'
import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export class EventDal {
  async create(input: EventDomainProps, tx?: Prisma.TransactionClient) {
    const client = prisma;
    await client.flareEvent.create({ data: input });
  }
}

export const eventDal = new EventDal();

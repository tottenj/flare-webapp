import { EventDomainProps } from '@/lib/domain/eventDomain/EventDomain';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export class EventDal {
  async create(input: EventDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.event.create({ data: input });
  }
}

export const eventDal = new EventDal();

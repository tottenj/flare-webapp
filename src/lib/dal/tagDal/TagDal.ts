import { Prisma } from '@prisma/client';

export default class TagDal {
  async createAndIncrement(label: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.tag.upsert({
      where: { label: label },
      update: { usageCount: { increment: 1 } },
      create: { label: label, usageCount: 1 },
      select: { id: true },
    });
  }
}

export const tagDal = new TagDal();

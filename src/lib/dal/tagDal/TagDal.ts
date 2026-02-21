import { Prisma } from '@prisma/client';

export default class TagDal {
  async upsertAndIncrement(tag: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.tag.upsert({
      where: { label: tag },
      create: {
        label: tag,
        usageCount: 1,
      },
      update: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }
}

export const tagDal = new TagDal()


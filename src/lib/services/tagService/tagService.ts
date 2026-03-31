import { tagDal } from '@/lib/dal/tagDal/TagDal';
import { normalizeTag } from '@/lib/utils/normalize/normalizeTag/normalizeTag';
import { Prisma } from '#prisma/generated/client';

export default class tagService {
  static async createAndIncrementMany(
    rawLabels: string[],
    tx?: Prisma.TransactionClient
  ): Promise<string[]> {
    const uniqueLabels = [...new Set(rawLabels.map(normalizeTag).filter(Boolean))];
    if (uniqueLabels.length === 0) return [];
    return await Promise.all(
      uniqueLabels.map(async (label) => {
        const fullTag = await tagDal.createAndIncrement(label, tx);
        return fullTag.id;
      })
    );
  }


  static async decrementMany(tagIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.tag.updateMany({
      where: {
        id: { in: tagIds },
      },
      data: {
        usageCount: { decrement: 1 },
      },
    });
  }


  static async deleteUnused(tagIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.tag.deleteMany({
      where: {
        id: { in: tagIds },
        usageCount: { lte: 0 },
      },
    });
  }
}


import { tagDal } from '@/lib/dal/tagDal/TagDal';
import { normalizeTag } from '@/lib/utils/normalize/normalizeTag/normalizeTag';
import { Prisma } from '@prisma/client';

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
}

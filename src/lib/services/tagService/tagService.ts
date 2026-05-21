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

  private static diffTags(
    prevTags: { tag: { label: string; id: string } }[],
    newTagLabels: string[]
  ) {
    const prevLabelSet = new Set(prevTags.map(({ tag }) => tag.label));
    const newLabelSet = new Set(newTagLabels);

    const toAdd = newTagLabels.filter((label) => !prevLabelSet.has(label));

    const toRemove = prevTags
      .filter(({ tag }) => !newLabelSet.has(tag.label))
      .map(({ tag }) => tag);

    return { toAdd, toRemove };
  }

  static async applyTagDiff(
    prevTags: { tag: { label: string; id: string } }[],
    newLabels: string[],
    tx: Prisma.TransactionClient
  ) {
    const { toAdd, toRemove } = this.diffTags(prevTags, newLabels);
    const newTagIds = await this.createAndIncrementMany(toAdd, tx);

    if (toRemove.length > 0) {
      const ids = toRemove.map((t) => t.id);
      await this.decrementMany(ids, tx);
      await this.deleteUnused(ids, tx);
    }

    const newLabelSet = new Set(newLabels);
    const remainingIds = prevTags
      .filter(({ tag }) => newLabelSet.has(tag.label))
      .map(({ tag }) => tag.id);

    return [...remainingIds, ...newTagIds];
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

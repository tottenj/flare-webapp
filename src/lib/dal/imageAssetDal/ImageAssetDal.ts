import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export type DeletedImageAsset = {
  id: string;
  storagePath: string;
};

export default class ImageAssetDal {
  async create(input: ImageMetadata, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.imageAsset.create({
      data: input,
    });
  }

  async delete(imageAssetId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.imageAsset.delete({
      where: { id: imageAssetId },
    });
  }

  async deleteMany(imageAssetIds: string[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    await client.imageAsset.deleteMany({
      where: { id: { in: imageAssetIds } },
    });
  }

  async findOrphans(tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return client.imageAsset.findMany({
      where: {
        profilePics: { none: {} },
        orgProofFiles: { none: {} },
        events: { none: {} },
      },
    });
  }
}

export const imageAssetDal = new ImageAssetDal();

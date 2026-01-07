import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export default class ImageAssetDal {
  async create(input: ImageMetadata, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.imageAsset.create({
      data: input,
    });
  }


  async delete(imageAssetId: string){
    await prisma.imageAsset.delete({
      where:{id: imageAssetId}
    })
  }
}

export const imageAssetDal = new ImageAssetDal();

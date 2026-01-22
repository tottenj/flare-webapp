import { Prisma } from '../../../../prisma/generated/prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

export default class ProfilePicDal {
  async upsertForUser(userId: string, imageAssetId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma

    await client.profilePic.upsert({
      where: { userId: userId },
      update: { imageAssetId },
      create: {
        userId: userId,
        imageAssetId: imageAssetId,
      },
    });
  }

  async getByUserId(userId:string, tx?:Prisma.TransactionClient){
    const client = tx ?? prisma
    return await client.profilePic.findUnique({
      where:{userId: userId},
      include:{
        imageAsset: true
      }
    })
  }
}

export const profilePicDal = new ProfilePicDal();

import 'server-only';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UniqueConstraintError } from '../../errors/DalErrors';
import { prisma } from '../../../../prisma/prismaClient';
import { DeletedImageAsset } from '@/lib/dal/imageAssetDal/ImageAssetDal';

export class UserDal {
  async findByFirebaseUid(
    firebaseUid: string,
    tx?: Prisma.TransactionClient
  ): Promise<User | null> {
    const client = tx ?? prisma;
    return await client.user.findUnique({
      where: { firebaseUid },
    });
  }

  async findContextByFirebaseUid(firebaseUid: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    return await client.user.findUnique({
      where: { firebaseUid },
      include: {
        organizationProfile: true,
        profilePic: {
          include: { imageAsset: true },
        },
      },
    });
  }

  async create(input: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User> {
    if (tx) return await tx.user.create({ data: input });
    return await prisma.user.create({ data: input });
  }

  async createIfNotExists(
    input: Prisma.UserCreateInput,
    tx?: Prisma.TransactionClient
  ): Promise<User> {
    const client = tx ?? prisma;

    const existing = await this.findByFirebaseUid(input.firebaseUid, client);
    if (existing) return existing;

    try {
      return await client.user.create({ data: input });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError('User already exists');
      }
      throw e;
    }
  }

  async markActive(firebaseUid: string): Promise<User> {
    return await prisma.user.update({
      where: { firebaseUid },
      data: {
        status: 'ACTIVE',
      },
    });
  }

  async deleteUser(userId: string, tx?: Prisma.TransactionClient): Promise<DeletedImageAsset[]> {
    const client = tx ?? prisma;

    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        profilePic: {
          select: {
            imageAsset: {
              select: { id: true, storagePath: true },
            },
          },
        },
        organizationProfile: {
          select: {
            proofs: {
              select: {
                imageAsset: {
                  select: { id: true, storagePath: true },
                },
              },
            },
            events: {
              select: {
                image: {
                  select: { id: true, storagePath: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    const assets: DeletedImageAsset[] = [];

    if (user.profilePic?.imageAsset) {
      assets.push(user.profilePic.imageAsset);
    }

    user.organizationProfile?.proofs.forEach((p) => {
      if (p.imageAsset) assets.push(p.imageAsset);
    });

    user.organizationProfile?.events.forEach((e) => {
      if (e.image) assets.push(e.image);
    });

    await client.user.delete({
      where: { id: userId },
    });

    return assets;
  }
}

export const userDal = new UserDal();

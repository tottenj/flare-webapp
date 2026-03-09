import 'server-only';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UniqueConstraintError } from '../../errors/DalErrors';
import { prisma } from '../../../../prisma/prismaClient';

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

  async deleteUser(userId: string, tx?: Prisma.TransactionClient): Promise<string[]> {
    const client = tx ?? prisma;

    const user = await client.user.findUnique({
      where: { id: userId },
      select: {
        profilePic: {
          select: {
            imageAsset: {
              select: { storagePath: true },
            },
          },
        },
        organizationProfile: {
          select: {
            proofs: {
              select: {
                imageAsset: {
                  select: { storagePath: true },
                },
              },
            },
            events: {
              select: {
                image: {
                  select: { storagePath: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) return [];

    const paths: string[] = [];

    if (user.profilePic?.imageAsset.storagePath) {
      paths.push(user.profilePic.imageAsset.storagePath);
    }

    user.organizationProfile?.proofs.forEach((p) => {
      if (p.imageAsset.storagePath) paths.push(p.imageAsset.storagePath);
    });

    user.organizationProfile?.events.forEach((e) => {
      if (e.image?.storagePath) paths.push(e.image.storagePath);
    });

    await client.user.delete({
      where: { id: userId },
    });

    return paths;
  }
}

export const userDal = new UserDal();

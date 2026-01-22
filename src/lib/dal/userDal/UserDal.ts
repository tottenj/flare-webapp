import 'server-only';
import { Prisma, User } from '../../../../prisma/generated/prisma/client';
import { PrismaClientKnownRequestError } from '../../../../prisma/generated/prisma/internal/prismaNamespace'; 
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
}

export const userDal = new UserDal();

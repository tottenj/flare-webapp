import 'server-only';
import { Prisma, User } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UniqueConstraintError } from '../../errors/DalErrors';
import { prisma } from '../../../../prisma/prismaClient';

export class UserDal {
  async findByFirebaseUid(firebaseUid: string, tx?:Prisma.TransactionClient): Promise<User | null> {
    const client = tx ?? prisma
    return await client.user.findUnique({
      where: { firebaseUid },
    });
  }

  async create(input: Prisma.UserCreateInput, tx?:Prisma.TransactionClient): Promise<User> {
    if(tx) return await tx.user.create({data:input})
    return await prisma.user.create({ data: input });
  }

  async createIfNotExists(input: Prisma.UserCreateInput, tx?: Prisma.TransactionClient): Promise<User> {
    const existing = await this.findByFirebaseUid(input.firebaseUid);
    if (existing) return existing;
    try {
      return await this.create(input, tx);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError();
      }
      throw e;
    }
  }

  async markEmailVerified(firebaseUid: string): Promise<User> {
    return await prisma.user.update({
      where: { firebaseUid },
      data: {
        emailVerified: true,
        status: 'ACTIVE',
      },
    });
  }
}

export const userDal = new UserDal();

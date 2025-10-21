import { Prisma } from '@/app/generated/prisma';
import prisma from '../prisma';

export default class flareUserDal {
  async createFlareUser(data: Prisma.FlareUserCreateInput, tx?: Prisma.TransactionClient) {
    const db = tx ?? prisma;
    await db.flareUser.create({
      data
    });
  }
}

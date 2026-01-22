import { OrgProfileDomainProps } from '@/lib/domain/orgProfileDomain/OrgProfileDomain';
import { prisma } from '../../../../prisma/prismaClient';
import { Prisma } from '../../../../prisma/generated/prisma/client';
import { UniqueConstraintError } from '@/lib/errors/DalErrors';
import { PrismaClientKnownRequestError } from "../../../../prisma/generated/prisma/internal/prismaNamespace"

export class OrgProfileDal {
  async create(input: OrgProfileDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    try {
      const org = await client.organizationProfile.create({ data: input });
      return org;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError('User already exists');
      }
      throw e;
    }
  }
}

export const orgProfileDal = new OrgProfileDal();

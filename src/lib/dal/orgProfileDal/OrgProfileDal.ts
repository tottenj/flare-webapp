import { OrgProfileDomainProps } from '@/lib/domain/orgProfileDomain/OrgProfileDomain';
import { prisma } from '../../../../prisma/prismaClient';
import { Prisma } from '#prisma/generated/client';
import { UniqueConstraintError } from '@/lib/errors/DalErrors';
import { OrgCardInclude, OrgCardRow } from '@/lib/types/dto/org/OrgCardDto';
import { AdminOrgRow, adminOrgRowInclude } from '@/lib/types/dto/admin/AdminOrgDetailsDto';

export class OrgProfileDal {
  async create(input: OrgProfileDomainProps, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    try {
      const org = await client.organizationProfile.create({ data: input });
      return org;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new UniqueConstraintError('User already exists');
      }
      throw e;
    }
  }

  async getAdminOrgCards(tx?: Prisma.TransactionClient): Promise<OrgCardRow[]> {
    const client = tx ?? prisma;
    return await client.organizationProfile.findMany({
      where: {
        status: 'PENDING',
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: OrgCardInclude,
    });
  }

  async getAdminOrgDetails(
    orgId: string,
    tx?: Prisma.TransactionClient
  ): Promise<AdminOrgRow | null> {
    const client = tx ?? prisma;
    return await client.organizationProfile.findFirst({
      where: {
        id: orgId,
        status: 'PENDING',
      },
      include: adminOrgRowInclude,
    });
  }

  async verifyOrg(orgId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const result = await client.organizationProfile.updateMany({
      where: {
        id: orgId,
        status: 'PENDING',
      },
      data: {
        status: 'VERIFIED',
      },
    });

    return result.count > 0;
  }
}

export const orgProfileDal = new OrgProfileDal();

import { ProofPlatformType } from '@/lib/schemas/proof/ProofPlatformSchema';
import { Prisma } from '@prisma/client';
import { prisma } from '../../../../prisma/prismaClient';

type OrgSocialInput = {
  platform: ProofPlatformType;
  handle: string;
};

export class OrgSocialDal {
  async create(orgId: string, input: OrgSocialInput[], tx?: Prisma.TransactionClient) {
    const client = tx ?? prisma;
    const data: Prisma.OrgSocialCreateInput = {
      organization: { connect: { id: orgId } },
    };

    for (const s of input) {
      switch (s.platform) {
        case 'INSTAGRAM':
          data.instagramHandle = s.handle;
          break;
        case 'FACEBOOK':
          data.facebookHandle = s.handle;
          break;
        case 'X':
          data.xHandle = s.handle;
          break;
        case 'OTHER':
          data.otherText = s.handle;
          break;
      }
    }
    return await client.orgSocial.create({ data });
  }
}

export const orgSocialDal = new OrgSocialDal();

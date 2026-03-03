import { Prisma } from '@prisma/client';
import deepMerge from '../utils/deepMerge';
import { createLocationIntegration } from './location.factory';
import { prisma } from '../../../prisma/prismaClient';
import { createUserIntegration } from './user.factory';


function buildBaseOrg(userId: string, locationId: string): Prisma.OrganizationProfileCreateInput {
  return {
    user: { connect: { id: userId } },
    orgName: `Test Org`,
    status: 'VERIFIED',
    location: { connect: { id: locationId } },
  };
}

export async function createOrgIntegration(overrides?: {
  user?: Partial<Prisma.UserCreateInput>;
  org?: Partial<Prisma.OrganizationProfileCreateInput>;
}) {

  const user = await createUserIntegration(overrides?.user);
  const location = await createLocationIntegration();
  const org = await prisma.organizationProfile.create({
    data: deepMerge(buildBaseOrg(user.id, location.id), overrides?.org),
  });
  return { user, org, location };
}

import { AdminService } from '@/lib/services/adminService/AdminService';
import { createAdminIntegration } from '../../factories/integration/admin.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { expect } from '@jest/globals';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { prisma } from '../../../prisma/prismaClient';

describe('AdminService.verifyOrg (integration)', () => {
  it('successfully verifies a pending organization', async () => {
    const { org } = await createOrgIntegration({ org: { status: 'PENDING' } });
    const admin = await createAdminIntegration();
    const adminActor: AuthenticatedUser = { firebaseUid: admin.firebaseUid, userId: admin.id };

    const result = await AdminService.verifyOrg(adminActor, org.id);
    expect(result).toBeUndefined();

    const orgNow = await prisma.organizationProfile.findUnique({ where: { id: org.id } });
    expect(orgNow?.status).toBe('VERIFIED');
  });


  it("throws if user is not an admin", async () => {
    const { org } = await createOrgIntegration({ org: { status: 'PENDING' } });
    const nonAdmin = await createOrgIntegration();
    const nonAdminActor: AuthenticatedUser = { firebaseUid: nonAdmin.user.firebaseUid, userId: nonAdmin.user.id };
    await expect(AdminService.verifyOrg(nonAdminActor, org.id)).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
  });

  it('throws when organization is not pending', async () => {
    const { org } = await createOrgIntegration({ org: { status: 'VERIFIED' } });
    const admin = await createAdminIntegration();
    const adminActor: AuthenticatedUser = { firebaseUid: admin.firebaseUid, userId: admin.id };

    await expect(AdminService.verifyOrg(adminActor, org.id)).rejects.toMatchObject({
      code: 'ORG_NOT_PENDING_OR_NOT_FOUND',
    });
  });

});

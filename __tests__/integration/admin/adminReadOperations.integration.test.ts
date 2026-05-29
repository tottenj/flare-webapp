import { AdminService } from '@/lib/services/adminService/AdminService';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { expect } from '@jest/globals';
import { createAdminIntegration } from '../../factories/integration/admin.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import { card } from '@heroui/react';

describe('AdminService admin read operations (integration)', () => {
  describe('getUnverifiedOrgCards', () => {
    it('returns only pending organizations for admins in createdAt desc order', async () => {
      const admin = await createAdminIntegration();
      const adminActor: AuthenticatedUser = { firebaseUid: admin.firebaseUid, userId: admin.id };

      const olderPending = await createOrgIntegration({
        org: { status: 'PENDING', orgName: 'Older Pending' },
      });
      await createOrgIntegration({ org: { status: 'VERIFIED', orgName: 'Verified Org', id: "notToBeIncluded" } });
      const newerPending = await createOrgIntegration({
        org: { status: 'PENDING', orgName: 'Newer Pending' },
      });

      const cards = await AdminService.getUnverifiedOrgCards(adminActor);

      expect(cards).toHaveLength(2);
      expect(cards.map((card) => card.id)).toEqual([newerPending.org.id, olderPending.org.id]);

      const ids = cards.map((card) => card.id);
      expect(ids).not.toContain("notToBeIncluded");

      expect(cards).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: olderPending.org.id,
            orgName: 'Older Pending',
            location: olderPending.location.address,
            profilePicPath: null,
          }),
          expect.objectContaining({
            id: newerPending.org.id,
            orgName: 'Newer Pending',
            location: newerPending.location.address,
            profilePicPath: null,
          }),
        ])
      );
    });

    it('throws when user is not an admin', async () => {
      const nonAdmin = await createOrgIntegration();
      const nonAdminActor: AuthenticatedUser = {
        firebaseUid: nonAdmin.user.firebaseUid,
        userId: nonAdmin.user.id,
      };

      await expect(AdminService.getUnverifiedOrgCards(nonAdminActor)).rejects.toMatchObject({
        code: 'AUTH_UNAUTHORIZED',
      });
    });
  });

  describe('getUnverifiedOrgDetails', () => {
    it('returns mapped details for a pending organization', async () => {
      const admin = await createAdminIntegration();
      const adminActor: AuthenticatedUser = { firebaseUid: admin.firebaseUid, userId: admin.id };
      const { user, org, location } = await createOrgIntegration({
        org: { status: 'PENDING', orgName: 'Pending Detail Org' },
      });

      const details = await AdminService.getUnverifiedOrgDetails(adminActor, org.id);

      expect(details).toMatchObject({
        id: org.id,
        orgName: 'Pending Detail Org',
        email: user.email,
        location: location.address,
        profilePicPath: null,
        socials: null,
        proofs: [],
      });
    });

    it('returns null when the organization is not pending', async () => {
      const admin = await createAdminIntegration();
      const adminActor: AuthenticatedUser = { firebaseUid: admin.firebaseUid, userId: admin.id };
      const { org } = await createOrgIntegration({ org: { status: 'VERIFIED' } });

      const details = await AdminService.getUnverifiedOrgDetails(adminActor, org.id);

      expect(details).toBeNull();
    });

    it('throws when user is not an admin', async () => {
      const nonAdmin = await createOrgIntegration();
      const nonAdminActor: AuthenticatedUser = {
        firebaseUid: nonAdmin.user.firebaseUid,
        userId: nonAdmin.user.id,
      };

      await expect(
        AdminService.getUnverifiedOrgDetails(nonAdminActor, nonAdmin.org.id)
      ).rejects.toMatchObject({
        code: 'AUTH_UNAUTHORIZED',
      });
    });
  });
});

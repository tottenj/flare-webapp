import { expect } from '@jest/globals';
import getAuthenticatedUser from '@/lib/auth/utils/getAuthenticatedUser';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { UserContextService } from './userContextService';

jest.mock('@/lib/auth/utils/getAuthenticatedUser');
jest.mock('@/lib/dal/userDal/UserDal', () => ({
  userDal: { findContextByFirebaseUid: jest.fn() },
}));
jest.mock('next/navigation', () => ({
  redirect: (url: string) => {
    throw new Error(url);
  },
}));

const memberships = [
  {
    role: 'OWNER',
    organization: {
      id: 'org-1',
      orgName: 'First org',
      status: 'VERIFIED',
      locationId: 'location-1',
    },
  },
  {
    role: 'EDITOR',
    organization: { id: 'org-2', orgName: 'Second org', status: 'DRAFT', locationId: null },
  },
];

function mockUser(role: string, organizationMemberships = memberships) {
  jest.mocked(getAuthenticatedUser).mockResolvedValue({
    uid: 'firebase-user',
    email: 'user@example.com',
    emailVerified: true,
    role: 'ADMIN',
  });
  (userDal.findContextByFirebaseUid as jest.Mock).mockResolvedValue({
    id: 'user-1',
    firebaseUid: 'firebase-user',
    email: 'user@example.com',
    role,
    organizationMemberships,
    profilePic: null,
  });
}

describe('UserContextService', () => {
  it('requires a Firebase session before loading user context', async () => {
    jest.mocked(getAuthenticatedUser).mockResolvedValue(null);
    await expect(UserContextService.requireNone()).resolves.toBeNull();
    await expect(UserContextService.requireUser()).rejects.toThrow('/signin');
    expect(userDal.findContextByFirebaseUid).not.toHaveBeenCalled();
  });

  it('loads all memberships and scopes the actor to the requested organization', async () => {
    mockUser('USER');
    const { ctx, membership } = await UserContextService.requireOrg('org-2');

    expect(userDal.findContextByFirebaseUid).toHaveBeenCalledWith('firebase-user');
    expect(ctx.organizationMemberships).toEqual(memberships);
    expect(membership.role).toBe('EDITOR');
    expect(UserContextService.getOrgActor(ctx, membership)).toEqual({
      userId: 'user-1',
      firebaseUid: 'firebase-user',
      orgId: 'org-2',
    });
    expect(UserContextService.getEventActor(ctx).organizationIds).toEqual(['org-1', 'org-2']);
    await expect(UserContextService.requireOrg('other-org')).rejects.toThrow('/dashboard');
    await expect(UserContextService.requireAdmin()).rejects.toThrow('/');
  });

  it('keeps global admins independent from organization memberships', async () => {
    mockUser('ADMIN', []);
    await expect(UserContextService.requireAdmin()).resolves.toMatchObject({
      user: { role: 'ADMIN' },
      organizationMemberships: [],
    });
    await expect(UserContextService.requireOrg('org-1')).rejects.toThrow('/dashboard');
  });

  it('accepts legacy accounts with no memberships as regular users', async () => {
    mockUser('ORG', []);
    await expect(UserContextService.requireUser()).resolves.toMatchObject({
      user: { role: 'USER' },
      organizationMemberships: [],
    });
    await expect(UserContextService.requireOrg('org-1')).rejects.toThrow('/dashboard');
  });
});

import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';

const baseAuthOrg: AuthenticatedOrganization = {
  userId: 'userId',
  orgId: 'orgId',
  firebaseUid: 'firebaseUid',
};

export function authOrgFactory(
  overrides?: Partial<AuthenticatedOrganization>
): AuthenticatedOrganization {
  return {
    ...baseAuthOrg,
    ...overrides,
  };
}
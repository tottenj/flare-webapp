import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';

export function authOrgFactory(
  overrides: Partial<AuthenticatedOrganization> = {}
): AuthenticatedOrganization {
  return {
    orgId: 'org1',
    firebaseUid: 'uid3',
    userId: '3',
    ...overrides,
  };
}

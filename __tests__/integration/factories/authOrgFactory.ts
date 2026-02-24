import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';

export default function authOrgFactoryIntegration(): AuthenticatedOrganization {
  return {
    orgId: 'org1',
    firebaseUid: 'uid3',
    userId: '3',
  };
}

import { authOrgFactory } from '../../auth/authOrg.factory';
import { createOrgIntegration } from '../org.factory';

export async function createAuthOrgIntegration() {
  const fakeOrg = await createOrgIntegration();
  const { user } = fakeOrg;

  return {
    fakeOrg,
    
    authUser: authOrgFactory({
      firebaseUid: user.firebaseUid,
      userId: user.id,
      orgId: fakeOrg.org.id,
    }),
  };
}

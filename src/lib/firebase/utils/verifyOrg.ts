import { User } from 'firebase/auth';
import 'server-only';
import { getAuthenticatedAppForUser } from '../auth/configs/serverApp';

export default async function verifyOrg(currentUser?: User) {
  if (!currentUser) {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) return false;
    const token = await currentUser.getIdTokenResult();
    const claims = token.claims.organization as unknown as boolean;
    return claims;
  } else {
    const token = await currentUser.getIdTokenResult();
    const claims = token.claims.organization as unknown as boolean;
    return claims;
  }
}

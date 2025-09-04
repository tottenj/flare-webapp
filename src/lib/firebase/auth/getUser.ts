import isOrganization from '@/lib/utils/authentication/isOrganization';
import { getClaims } from '../utils/getClaims';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getFirestoreFromServer } from './configs/getFirestoreFromServer';
import FlareUser from '@/lib/classes/flareUser/FlareUser';

export default async function getUser() {
  const { currentUser, claims } = await getClaims();
  const { fire } = await getFirestoreFromServer();

  if (currentUser) {
    if (claims && claims.organization === true) {
      return FlareOrg.getOrg(fire, currentUser.uid);
    } else {
      return FlareUser.getUserById(currentUser.uid, fire);
    }
  }
}

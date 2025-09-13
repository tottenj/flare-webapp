import 'server-only';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { getClaims } from '@/lib/firebase/utils/getClaims';

export default async function isOrganization() {
  const { claims, currentUser } = await getClaims();
  if(!claims || !claims.organization === true || !currentUser) return false
  return {claims, currentUser}

}

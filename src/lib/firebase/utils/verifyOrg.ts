"use server"
import { User } from 'firebase/auth';

import { getAuthenticatedAppForUser } from '../auth/configs/serverApp';

export default async function verifyOrg(currentUser?: User) {
  if (!currentUser) {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) return {claims: false, currentUser: null};
    const token = await currentUser.getIdTokenResult();
    const claims = token.claims.organization as unknown as boolean;
    const isAdmin = token.claims.admin as unknown as boolean;
    return {claims, currentUser, isAdmin};
  } else {
    const token = await currentUser.getIdTokenResult();
    const claims = token.claims.organization as unknown as boolean;
    const isAdmin = token.claims.admin as unknown as boolean
    return {claims, currentUser, isAdmin};
  }
}

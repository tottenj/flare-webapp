import "server-only"
import { getAuthenticatedAppForUser } from "./configs/serverApp";
import isUsersAccount from "./isUsersAccount";

export default async function checkAuth(requiredClaims?: string[]) {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) return null
    const {uid} = currentUser
    const tokenResult = await currentUser.getIdTokenResult(true);
    const { claims } = tokenResult;
    

    if (!uid || !tokenResult) return null
    if (requiredClaims && !requiredClaims.every((c) => claims[c])) {
      throw new Error("Does not have needed claims")
    }
    

    return { uid, claims };
  } catch (err) {
    console.error('Failed to get claims:', err);
    return null
  }
}

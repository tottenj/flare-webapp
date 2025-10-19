
import { getAuthenticatedAppForUser } from "../auth/configs/serverApp";

export const getClaims = async () => {
  try {
    const { currentUser } = await getAuthenticatedAppForUser();
    if (!currentUser) return null;
    const uid = "dljs"

    
  } catch (err) {

    return null;
  }
};

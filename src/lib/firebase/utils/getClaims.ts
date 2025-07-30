
import { getAuthenticatedAppForUser } from "../auth/configs/serverApp";
import { cache } from "react";

export const getClaims = cache(async () =>  {
    let claims = null
    const {currentUser} = await getAuthenticatedAppForUser()
    const claimsObj = await currentUser?.getIdTokenResult()
    claims = claimsObj?.claims
    return {currentUser, claims}
})
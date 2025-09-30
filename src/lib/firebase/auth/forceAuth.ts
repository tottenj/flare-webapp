

import { signInWithCustomToken } from "firebase/auth";
import { auth } from "./configs/clientApp";

export async function forceAuth(idToken: string) {
  await signInWithCustomToken(auth, idToken);
}
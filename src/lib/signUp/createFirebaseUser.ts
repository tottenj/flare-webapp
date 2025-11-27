import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/auth/configs/clientApp";

export async function firebaseCreateUser(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  const idToken = await cred.user.getIdToken(true);
  return { cred, idToken };
}

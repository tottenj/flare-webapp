import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase/auth/configs/clientApp";

export default async function firebaseSignUpHelper(email: string, password: string) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);
  const idToken = await cred.user.getIdToken();
  return idToken
}

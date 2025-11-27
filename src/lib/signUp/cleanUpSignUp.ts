import { deleteUser, signOut, UserCredential } from "firebase/auth";
import { auth } from "../firebase/auth/configs/clientApp";

export async function cleanup(cred?: UserCredential) {
  await fetch('/api/loginToken', { method: 'DELETE' });
  if (cred) await deleteUser(cred.user);
  await signOut(auth);
  sessionStorage.removeItem('manualLoginInProgress');
}

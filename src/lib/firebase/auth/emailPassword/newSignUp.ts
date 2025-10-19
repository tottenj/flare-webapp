'use client';

import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../configs/clientApp';

export default async function newSignUp(
  formData: FormData,
  serverAction: (formData: FormData) => Promise<any>
) {
  sessionStorage.setItem('manualLoginInProgress', 'true');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  let userCred;

  try {
    userCred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken(true);
    const cookieRes = await fetch('/api/loginToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
      cache: "no-store"
    });
    if (!cookieRes.ok) throw new Error('Failed to set session cookie');
    await serverAction(formData);
    await sendEmailVerification(userCred.user)
    await signOut(auth);
    await fetch('/api/loginToken', { method: 'DELETE' });
    sessionStorage.removeItem('manualLoginInProgress');
  } catch (err: any) {
    if (userCred?.user) await deleteUser(userCred.user);
    sessionStorage.removeItem('manualLoginInProgress');
    throw err;
  }
}

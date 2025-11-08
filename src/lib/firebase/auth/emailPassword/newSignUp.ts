'use client';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '../configs/clientApp';

export default async function newSignUp(formData: FormData) {
  sessionStorage.setItem('manualLoginInProgress', 'true');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  if(!email || !password) throw new Error("Need Both Email And Password")
  let userCred;

  try {
    userCred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken(true);
    formData.append('idToken', token);
    const cookieRes = await fetch('/api/loginToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
      cache: 'no-store',
    });
    if (!cookieRes.ok) throw new Error('Failed to set session cookie');
    
    const res = await fetch('/api/auth/signUp', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Sign up error');
    await sendEmailVerification(userCred.user);
    await signOut(auth);
    await fetch('/api/loginToken', { method: 'DELETE' });
    sessionStorage.removeItem('manualLoginInProgress');
  } catch (err: any) {
    try {
      await fetch('/api/loginToken', { method: 'DELETE' });
    } catch (error) {
      ('could not delete token');
    }
    if (userCred?.user) await deleteUser(userCred.user);
    sessionStorage.removeItem('manualLoginInProgress');
    throw err;
  }
}

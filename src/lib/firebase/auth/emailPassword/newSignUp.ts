'use client';
import {
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
  signOut,
} from 'firebase/auth';
import { auth } from '../configs/clientApp';
import signUpOrg from '@/lib/formActions/auth/signUpOrg/signUpOrg';
import signUpUser from '@/lib/formActions/auth/signUpUser/signUpUser';

export default async function newSignUp(formData: FormData) {
  sessionStorage.setItem('manualLoginInProgress', 'true');
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const accountType = formData.get('account_type') as string;
  if (!email || !password) throw new Error('Need Both Email And Password');
  let userCred;

  try {
    userCred = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCred.user.getIdToken(true);
    formData.append('idToken', token);
    // Set session cookie
    const cookieRes = await fetch('/api/loginToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: token }),
      cache: 'no-store',
    });
    if (!cookieRes.ok) throw new Error('Failed to set session cookie');

    if (accountType == 'user') {
      await signUpUser(formData);
    } else if (accountType == 'org') {
      await signUpOrg(formData);
    } else {
      throw new Error('Invalid Account Type');
    }

    const res = await fetch('/api/auth/signUp', {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Sign up error');
    await sendEmailVerification(userCred.user);
    return userCred.user.uid;
  } catch (err: any) {
    if (userCred?.user) await deleteUser(userCred.user);
    throw err;
  } finally {
    await signOut(auth);
    await fetch('/api/loginToken', { method: 'DELETE' });
    sessionStorage.removeItem('manualLoginInProgress');
  }
}

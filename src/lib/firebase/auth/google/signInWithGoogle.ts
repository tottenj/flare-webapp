'use server';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { auth } from '../configs/clientApp';

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userData = await FlareUser.getUserById(user.uid);

    if (userData) {
      return userData;
    } else {
      const flar = new FlareUser(user);
      await flar.addUser();
      return flar;
    }
  } catch (error) {
    console.error('Error signing in with Google', error);
    return undefined;
  }
}

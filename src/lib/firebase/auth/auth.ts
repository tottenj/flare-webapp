'use client';
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged as _onAuthStateChanged,
  onIdTokenChanged as _onIdTokenChanged,
  NextOrObserver,
  User,
} from 'firebase/auth';
import { auth, db } from './clientApp';
import FlareUser from '@/lib/classes/FlareUser';

export function onAuthStateChanged(cb: NextOrObserver<User>) {
  return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb: NextOrObserver<User>) {
  return _onIdTokenChanged(auth, cb);
}


export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const userData = await FlareUser.getUserById(user.uid)

    if (userData) {
      return userData;
    } else {
      const flar = new FlareUser(user)
      await flar.addUser()
      return flar
    }
  } catch (error) {
    console.error('Error signing in with Google', error);
  }
}

export async function signOut() {
  try {
    auth.signOut();
  } catch (error) {
    console.error('Error signing out with Google', error);
  }
}

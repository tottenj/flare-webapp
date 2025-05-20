'use server';
import { User } from 'firebase/auth';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import getFirestoreFromServer from '../configs/getFirestoreFromServer';

export async function signInWithGoogle(user:User) {
  const fire = await getFirestoreFromServer()

  try {
    const userData = await FlareUser.getUserById(user.uid, fire);
    if (userData) {
      return userData;
    } else {
      const flar = new FlareUser(user);
      console.log(flar)
      await flar.addUser(fire);
      return flar;
    }
  } catch (error) {
    console.error('Error signing in with Google', error);
    return undefined;
  }
}

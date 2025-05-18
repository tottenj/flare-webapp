'use server';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { auth } from '../../configs/clientApp';
import getFirestoreFromServer from '../../configs/getFirestoreFromServer';

export default async function emailAndPasswordAction(prevState: any, formData: FormData) {
  const rawFormData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  };



  if (rawFormData.email && rawFormData.password) {
    const { email, password } = rawFormData;
    try {
      const usr = await createUserWithEmailAndPassword(auth, email, password);
      const db = await getFirestoreFromServer();
      await new FlareUser(usr.user).addUser(db);
      await sendEmailVerification(usr.user);
      return { message: 'success' };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        return { message: 'Email is already in use' };
      } else {
        return { message: 'An error occurred. Please try again.' };
      }
    }
  } else {
    return { message: 'Error with email or password' };
  }
}

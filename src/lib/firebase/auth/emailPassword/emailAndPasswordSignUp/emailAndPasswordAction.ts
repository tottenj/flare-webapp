'use server';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { auth } from '../../configs/clientApp';
import {getFirestoreFromServer} from '../../configs/getFirestoreFromServer';
import getAuthError from '@/lib/utils/error/getAuthError';

export default async function emailAndPasswordAction(prevState: any, formData: FormData) {
  const rawFormData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  };



  if (rawFormData.email && rawFormData.password) {
    const { email, password } = rawFormData;
    try {
      const usr = await createUserWithEmailAndPassword(auth, email, password);
      const {fire} = await getFirestoreFromServer();
      await new FlareUser(usr.user).addUser(fire);
      await sendEmailVerification(usr.user);
      return { message: 'success' };
    } catch (error) {
      return {message: getAuthError(error)}
    }
  } else {
    return { message: 'Error with email or password' };
  }
}

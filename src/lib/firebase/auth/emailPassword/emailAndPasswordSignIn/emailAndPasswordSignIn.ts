"use server"
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../configs/clientApp';


export default async function emailAndPasswordSignIn(prevState: any, formData: FormData) {
  const rawFormData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  };

  if (rawFormData.email && rawFormData.password) {
    const { email, password } = rawFormData;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) {
        if (!user.user.emailVerified) {
          sendEmailVerification(user.user);
          await signOut(auth);
          return { message: 'Please Verify Account' };
        } else {
          return { message: 'success', email, password };
        }
      } else {
        return { message: 'No user exists with that account' };
      }
    } catch (error) {
      return { message: 'Error Logging In' };
    }
  }
  return {message: "Error Logging In Please Try Again"}
}

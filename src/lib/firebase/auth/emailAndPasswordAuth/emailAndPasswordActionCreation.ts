'use server';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../configs/clientApp';



export default async function emailAndPasswordAction(
  prevState: any,
  formData: FormData
) {
  const rawFormData = {
    email: formData.get("email")?.toString(),
    password: formData.get("password")?.toString(),
  };

  if (rawFormData.email && rawFormData.password) {
    const { email, password } = rawFormData;
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      return {message: "User created successfully"}
    } catch(error: any) {
      if(error.code === 'auth/email-already-in-use'){
        return {message: "Email is already in use"}
      }else{
        return {message: "An error occurred. Please try again."}
      }
    }
  } else {
    return { message: 'Error with email or password' };
  }
}

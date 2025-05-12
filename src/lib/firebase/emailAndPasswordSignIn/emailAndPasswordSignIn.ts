import { password } from '@/components/inputs/textInput/TextInput.stories';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../auth/configs/clientApp';

export default async function emailAndPasswordSignIn(prevState: any, formData: FormData) {
  const rawFormData = {
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
  };

  if (rawFormData.email && rawFormData.password) {
    const { email, password } = rawFormData;
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (!user.user.emailVerified) {
        await signOut(auth);
        return { message: 'Please Verify Account' };
      }else{
        return { message: 'User logged In successfully' };
      }
    } catch (error) {
      return { message: 'Error Logging In' };
    }
  }

  return { message: 'Error Logging In' };
}

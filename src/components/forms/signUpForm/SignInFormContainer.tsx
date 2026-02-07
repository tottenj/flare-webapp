'use client';
import { useRouter } from 'next/navigation';
import SignUpFormPresentational from './SignUpFormPresentational';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { ActionResult } from '@/lib/types/ActionResult';
import signInAction from '@/lib/auth/signInAction';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import GoogleSignInButton from '@/components/buttons/googleButton/SignInWithGoogleButton';

export default function SignInFormContainer() {
  const router = useRouter();

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    if (!email || !password) {
      return {
        ok: false,
        error: {
          message: 'Must Enter A Valid Email and Password',
          code: 'INVALID_INPUT',
        },
      };
    }

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.user.getIdToken();
      const result = await signInAction({ idToken });
      if (!result.ok && result.error.code == 'UNVERIFIED_EMAIL') {
        await sendEmailVerification(user.user);
        await signOut(auth);
      }
      return result;
    } catch (err) {
      return mapFirebaseAuthError(err);
    }
  }



  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    onSuccess: () => {
      router.push('/dashboard');
    },
  });

  return (
    <SignUpFormPresentational
      pending={pending}
      onSubmit={action}
      validationErrors={validationErrors}
      error={error?.message}
      signUp={false}
      googleButton={<GoogleSignInButton signIn={true} />}
    />
  );
}

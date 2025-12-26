'use client';

import { useFormAction } from '#src/lib/hooks/useFormAction.js';
import { ActionResult } from '#src/lib/types/ActionResult.js';
import { useRouter } from 'next/navigation';
import SignUpFormPresentational from './SignUpFormPresentational';
import { sendEmailVerification, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import signInAction from '#src/lib/auth/signInAction.js';

export default function SignInFormContainer() {
  const router = useRouter();

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await user.user.getIdToken();
      const result = await signInAction({ idToken });
      if (!result.ok && result.error.code == 'UNVERIFIED_EMAIL') {
        await sendEmailVerification(user.user);
        await signOut(auth)
      }
      return result;
    } catch (err) {
      return {
        ok: false,
        error: {
          code: 'CLIENT_SIGNIN_FAILED',
          message: 'Unable to login. Please try again.',
        },
      };
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
    />
  );
}

'use client';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import Link from 'next/link';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { signUpAction } from '@/lib/auth/signUpAction';
import { Form } from '@heroui/react';
import { useFormAction } from '@/lib/hooks/useFormAction';
import { ActionResult } from '@/lib/types/ActionResult';
import firebaseSignUpHelper from '@/lib/auth/firebaseSignUpHelper';

export default function SignUpForm() {
  const router = useRouter();

  async function submitAction(formData: FormData): Promise<ActionResult<null>> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const idToken = await firebaseSignUpHelper(email, password)
      const result = await signUpAction({ idToken });
      await signOut(auth);
      return result;
    } catch {
      return {
        ok: false,
        error: {
          code: 'CLIENT_SIGNUP_FAILED',
          message: 'Unable to sign up. Please try again.',
        },
      };
    }
  }

  const { action, pending, error, validationErrors } = useFormAction(submitAction, {
    onSuccess: () => {
      router.push('/confirmation');
    },
  });

  return (
    <div className="@container mt-16 mb-8 flex h-auto w-11/12 flex-col items-center justify-center rounded-xl bg-white p-4 pt-8 pb-8 sm:w-5/6 sm:p-10 lg:w-1/2">
      <ServerLogo size="medium" />
      <h1 className="mt-4 mb-4 text-4xl">Sign Up</h1>

      {error && <div className="rounded bg-red-50 p-3 text-red-700">{error.message}</div>}

      <Form
        validationErrors={validationErrors}
        action={action}
        className="mb-8 flex w-full flex-col sm:w-5/6 @lg:w-2/3"
      >
        <HeroInput label="Email" name="email" placeholder="example@gmail.com" />
        <HeroInput label="Password" name="password" placeholder="*******" type="password" />

        <div className="mt-4 flex justify-center">
          <PrimaryButton
            disabled={pending}
            text={pending ? 'Creating account…' : 'Submit'}
            type="submit"
            size="full"
            datacy='submit-button'
          />
        </div>
      </Form>

      <GoogleSignInButton signIn={false} />

      <Link
        className="font-nunito mt-4 text-center font-bold text-balance underline"
        href={'/signin'}
      >
        Already Have An Account? Login
      </Link>
    </div>
  );
}

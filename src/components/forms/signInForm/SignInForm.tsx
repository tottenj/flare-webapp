'use client';
import { useActionState } from 'react';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import TextInput from '../../inputs/textInput/TextInput';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import Link from 'next/link';
import emailAndPasswordAction from '@/lib/firebase/auth/emailPassword/emailAndPasswordSignUp/emailAndPasswordAction';
import emailAndPasswordSignIn from '@/lib/firebase/auth/emailPassword/emailAndPasswordSignIn/emailAndPasswordSignIn';

type SignInFormProps = {
  overrideAction?: typeof emailAndPasswordAction;
  signUp?: boolean;
};
export default function SignInForm({ overrideAction, signUp = true }: SignInFormProps) {
  const initialState = { message: '' };
  const action = signUp ? emailAndPasswordAction : emailAndPasswordSignIn;
  const [state, formAction, pending] = useActionState(overrideAction ?? action, initialState);
  const signUpOrIn = signUp == true ? 'Sign Up' : 'Login';
  const link = signUp == true ? './flare-signin' : './FlareSignIn';
  //const router = useRouter()

  useActionToast(state, pending, {
    successMessage: signUp ? 'User created successfully' : 'User logged In successfully',
    loadingMessage: signUp ? 'Creating your account' : 'Logging In...',
  });

  return (
    <div className="@container flex w-5/6 flex-col items-center rounded-xl bg-white p-10 lg:w-1/2">
      <h1 className="mb-4">{signUpOrIn}</h1>
      <form action={formAction} className="mb-8 w-5/6 @lg:w-2/3">
        <TextInput label="Email" name="email" placeholder="example@gmail.com" />
        <TextInput label="Password" name="password" placeholder="**********" type="password" />
        <div className="flex justify-center">
          <PrimaryButton text="Submit" type="submit" disabled={pending} size="full" />
        </div>
      </form>
      <GoogleSignInButton signIn={!signUp} />
      <Link href={link} className="hover:text-primary mt-4 text-blue-400">
        Organization? {signUpOrIn} here{' '}
      </Link>
    </div>
  );
}

'use client';
import { useActionState, useEffect } from 'react';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import TextInput from '../../inputs/textInput/TextInput';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import emailAndPasswordAction from '@/lib/firebase/auth/emailPassword/emailAndPasswordSignUp/emailAndPasswordAction';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LinkInput from '@/components/inputs/link/LinkInput';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';

type SignInFormProps = {
  overrideAction?: typeof emailAndPasswordAction;
  signUp?: boolean;
};
export default function SignUpForm({ overrideAction, signUp = true }: SignInFormProps) {
  const initialState = { message: '' };
  const [state, formAction, pending] = useActionState(
    overrideAction ?? emailAndPasswordAction,
    initialState
  );
  const router = useRouter()
 
  useActionToast(state, pending, {
    successMessage: 'User created successfully',
    loadingMessage: 'Creating your account',
  });


  useEffect(() => {
    if(state.message === "success"){
      router.push("/confirmation")
    }
  },[state])

  return (
    <div className="@container flex w-11/12 sm:w-5/6 h-auto mt-16 mb-8 flex-col justify-center items-center rounded-xl bg-white p-4 pt-8 pb-8 sm:p-10 lg:w-1/2">
      <ServerLogo size='medium'/>
      <h1 className="mb-4 mt-4 text-4xl">Sign Up</h1>
      <form action={formAction} className="mb-8 flex w-full sm:w-5/6 flex-col @lg:w-2/3">
        <TextInput label="Email" name="email" placeholder="example@gmail.com" />
        <TextInput label="Password" name="password" placeholder="**********" type="password" />
        <div className="flex justify-center">
          <PrimaryButton text="Submit" type="submit" disabled={pending} size="full" />
        </div>
      </form>
      <GoogleSignInButton signIn={!signUp} />
      <Link className="font-nunito mt-4 text-center text-balance font-bold underline" href={'/signin'}>
        Already Have An Account? Login
      </Link>
    </div>
  );
}

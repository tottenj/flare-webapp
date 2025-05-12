'use client';
import { useActionState } from 'react';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import TextInput from '../../inputs/textInput/TextInput';
import emailAndPasswordAction from '@/lib/firebase/auth/emailAndPasswordAuth/emailAndPasswordActionCreation';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import emailAndPasswordSignIn from '@/lib/firebase/emailAndPasswordSignIn/emailAndPasswordSignIn';
import { useRouter } from 'next/navigation';




type SignInFormProps = {
  overrideAction?: typeof emailAndPasswordAction;
  signUp?: boolean
};
export default function SignInForm({overrideAction, signUp = true}: SignInFormProps) {
  const initialState = { message: '' };
  const action = signUp ?  emailAndPasswordAction : emailAndPasswordSignIn
  const [state, formAction, pending] = useActionState(overrideAction ?? action, initialState);
  //const router = useRouter()

  useActionToast(state, pending, {
    successMessage: signUp ?  "User created successfully" : "User logged In successfully",
    loadingMessage: signUp ? 'Creating your account' : "Logging In..."
  })
/*
  if (state.message == 'Please Verify Account'){
    router.push("/")
  }
*/

  
    return (
      <div className="@container flex w-5/6 flex-col items-center rounded-xl bg-white p-10 lg:w-1/2">
        <h1 className="mb-4">{signUp == true ? 'Sign Up' : 'Login'}</h1>
        <form action={formAction} className="mb-8 w-5/6 @lg:w-2/3">
          <TextInput label="Email" name="email" placeholder="example@gmail.com" />
          <TextInput label="Password" name="password" placeholder="**********" password={true} />
          <div className="flex justify-center">
            <PrimaryButton text="Submit" type="submit" disabled={pending} size="full" />
          </div>
        </form>
        <GoogleSignInButton signIn={!signUp} />
      </div>
    );
}

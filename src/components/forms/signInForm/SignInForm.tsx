'use client';
import { useActionState } from 'react';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import TextInput from '../../inputs/textInput/TextInput';
import emailAndPasswordAction from '@/lib/firebase/auth/emailAndPasswordAuth/emailAndPasswordActionCreation';
import SubmitButton from '@/components/inputs/submitButton/SubmitButton';
import { toast } from 'react-toastify';
import { useActionToast } from '@/lib/hooks/useActionToast/useActionToast';



type SignInFormProps = {
  overrideAction?: typeof emailAndPasswordAction;
};
export default function SignInForm({overrideAction}: SignInFormProps) {
  const initialState = { message: '' };
  const [state, formAction, pending] = useActionState(overrideAction ?? emailAndPasswordAction, initialState);

  useActionToast(state, pending, {
    successMessage: "User created successfully",
    loadingMessage: 'Creating your account'
  })

  

  return (
    <div className="@container flex w-5/6 lg:w-1/2 flex-col items-center rounded-xl bg-white p-10">
      <h1 className="mb-4">Sign Up</h1>
      <form action={formAction} className="mb-8 w-5/6 @lg:w-2/3">
        <TextInput label="Email" name="email" placeholder="example@gmail.com" />
        <TextInput label="Password" name="password" placeholder="**********" password={true}/>
        <div className="flex justify-center">
          <SubmitButton disabled={pending}/>
        </div>
      </form>
      <GoogleSignInButton signIn={false} />
    </div>
  );
}

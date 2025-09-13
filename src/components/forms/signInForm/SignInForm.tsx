'use client';
import GoogleSignInButton from '@/components/buttons/googleButton/SignInWithGoogleButton';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import LogoWithText from '@/components/flare/logoWithText/LogoWithText';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import LinkInput from '@/components/inputs/link/LinkInput';
import TextInput from '@/components/inputs/textInput/TextInput';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import getAuthError from '@/lib/utils/error/getAuthError';
import { useWindowSize } from '@uidotdev/usehooks';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Link from 'next/link';
import { useRef } from 'react';
import { toast } from 'react-toastify';

export default function SignInForm() {
  const email = useRef<HTMLInputElement>(null);
  const pass = useRef<HTMLInputElement>(null);
  const {width} = useWindowSize()

  async function handleFormSubmit(e: any) {
    e.preventDefault();
    if (email.current?.value && pass.current?.value) {
      try {
        await signInWithEmailAndPassword(auth, email.current.value, pass.current.value);
      } catch (error) {
        toast.error(getAuthError(error));
      }
    }
  }

  return (
    <div className="@container mt-16 mb-8 flex h-auto w-11/12 flex-col items-center justify-center rounded-xl bg-white p-4 pt-8 pb-8 sm:w-5/6 sm:p-10 lg:w-1/2">
      <ServerLogo size="medium" />
    

      <h1 className="mt-4 mb-4 text-4xl">Sign In</h1>
      <form
        onSubmit={(e) => handleFormSubmit(e)}
        className="mb-8 flex w-full flex-col sm:w-5/6 @lg:w-2/3"
      >
        <TextInput ref={email} label="Email" name="email" placeholder="example@gmail.com" />
        <TextInput
          ref={pass}
          label="Password"
          name="password"
          placeholder="**********"
          type="password"
        />
        <div className="flex justify-center">
          <PrimaryButton text="Submit" type="submit" size="full" />
        </div>
      </form>
      <GoogleSignInButton signIn={true} />
      <Link
        className="font-nunito mt-4 text-center font-bold text-balance underline"
        href={'/signup'}
      >
        Don't Have An Account? Sign Up Now!
      </Link>
    </div>
  );
}

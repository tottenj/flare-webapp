'use client';

import signInAction from '@/lib/auth/signInAction';
import { signUpAction } from '@/lib/auth/signUpAction';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

interface googleSignInButtonProps {
  signIn: boolean;
}

export default function GoogleSignInButton({ signIn }: googleSignInButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken(true);

      let result = signIn ? await signInAction({ idToken }) : await signUpAction({ idToken });

      if (signIn && !result.ok && result.error.code === 'AUTH_SIGNIN_FAILED') {
        const signUpResult = await signUpAction({ idToken });
        if (!signUpResult.ok && signUpResult.error.code !== 'AUTH_USER_EXISTS') {
          toast.error(signUpResult.error.message);
          return;
        }
        result = await signInAction({ idToken });
      }

      if (!signIn) {
        if (!result.ok && result.error.code !== 'AUTH_USER_EXISTS') {
          toast.error(result.error.message);
          return;
        }
        result = await signInAction({ idToken });
      }

      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }

      router.push('/dashboard');
      return;
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      if (!mapped.ok) toast.error(mapped.error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      data-testid="google-signin-button"
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition duration-300 hover:bg-gray-100"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="mr-3 h-5 w-5"
      />
      {pending ? 'Please wait...' : `Sign ${signIn ? 'In' : 'Up'} With Google`}
    </button>
  );
}

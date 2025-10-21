'use client';

import { auth, db } from '@/lib/firebase/auth/configs/clientApp';

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface googleSignInButtonProps {
  signIn: boolean;
}

export default function GoogleSignInButton({ signIn }: googleSignInButtonProps) {
  async function handleClick(e: any) {
    e.preventDefault();

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

    } catch (error) {
      console.log('error: ', error);
    }
  }

  return (
    <button
      data-testid="google-signin-button"
      type="button"
      onClick={handleClick}
      className="flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 shadow-sm transition duration-300 hover:bg-gray-100"
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google logo"
        className="mr-3 h-5 w-5"
      />
      Sign {signIn ? 'In' : 'Up'} With Google
    </button>
  );
}

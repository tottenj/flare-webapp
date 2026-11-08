'use client';

import signInAction from '@/lib/auth/signInAction';
import { signUpAction } from '@/lib/auth/signUpAction';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import { toast } from '@heroui/react';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

interface googleSignInButtonProps {
  signIn: boolean;
}

export default function GoogleSignInButton({ signIn }: googleSignInButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    if (pending) return;
    setPending(true);

    try {
      const { auth } = await import('@/lib/firebase/auth/configs/clientApp');
      const provider = new GoogleAuthProvider();
      const res = await signInWithPopup(auth, provider);
      const idToken = await res.user.getIdToken(true);

      let result = signIn ? await signInAction({ idToken }) : await signUpAction({ idToken });

      if (signIn && !result.ok && result.error.code === 'AUTH_SIGNIN_FAILED') {
        const signUpResult = await signUpAction({ idToken });
        if (!signUpResult.ok) {
          toast.danger(signUpResult.error.message);
          return;
        }

        result = await signInAction({ idToken });
      }

      if (!signIn) {
        if (!result.ok) {
          toast.danger(result.error.message);
          return;
        }
        result = await signInAction({ idToken });
      }

      if (!result.ok) {
        toast.danger(result.error.message);
        return;
      }

      router.push('/dashboard');
      return;
    } catch (error) {
      const mapped = mapFirebaseAuthError(error);
      if (!mapped.ok) toast.danger(mapped.error.message);
    } finally {
      setPending(false);
    }
  }

  return (
    <HeroButton
      fullWidth
      data-testid="google-signin-button"
      type="button"
      variant="outline"
      onPress={handleClick}
      isDisabled={pending}
      className="flex items-center justify-center gap-3 font-medium"
    >
      <Image
        src="/GoogleLogo.webp"
        alt="Google logo"
        className="h-5 w-5"
        width={20}
        height={20}
      />
      {pending ? 'Please wait...' : `Sign ${signIn ? 'In' : 'Up'} With Google`}
    </HeroButton>
  );
}

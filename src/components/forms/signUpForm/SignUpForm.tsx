'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import GoogleSignInButton from '../../buttons/googleButton/SignInWithGoogleButton';
import ServerLogo from '@/components/flare/serverLogo/ServerLogo';
import Link from 'next/link';
import { toast } from 'react-toastify';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import signUpUserClient from '@/lib/signUp/signUpUserClient';

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pending, setPending] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    try {
      await signUpUserClient({
        email,
        password,
        accountType: 'user',
      });
      router.push('/confirmation');
    } catch (err: any) {
      toast.error(err.message || 'Sign up failed');
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="@container mt-16 mb-8 flex h-auto w-11/12 flex-col items-center justify-center rounded-xl bg-white p-4 pt-8 pb-8 sm:w-5/6 sm:p-10 lg:w-1/2">
      <ServerLogo size="medium" />
      <h1 className="mt-4 mb-4 text-4xl">Sign Up</h1>

      <form onSubmit={(e) => submit(e)} className="mb-8 flex w-full flex-col sm:w-5/6 @lg:w-2/3">
        <HeroInput
          label="Email"
          name="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <HeroInput
          label="Password"
          name="password"
          placeholder="*******"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="mt-4 flex justify-center">
          <PrimaryButton text="Submit" type="submit" disabled={pending} size="full" />
        </div>
      </form>

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

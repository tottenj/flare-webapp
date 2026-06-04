'use client';

import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';

import HeroInput from '@/components/inputs/hero/input/HeroInput';
import { Form } from '@heroui/react';
import Link from 'next/link';
import LogoWithText from '../../flare/logoWithText/LogoWithText';
import FormError from '@/components/errors/Formerror/FormError';

type Props = {
  pending: boolean;
  error?: string;
  validationErrors?: Record<string, string[]>;
  onSubmit: (formData: FormData) => void;
};

export default function ForgotPasswordFormPresentational({
  pending,
  error,
  validationErrors,
  onSubmit,
}: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-2xl bg-white p-4 shadow-2xl md:w-1/2 lg:w-2/5">
      <LogoWithText size="medium" />
      <h1 className="mt-4 mb-4 text-4xl">Forgot Password</h1>

      <FormError error={error} />

      <Form
        validationErrors={validationErrors}
        action={onSubmit}
        className="flex w-full flex-col gap-4 sm:w-5/6 @lg:w-2/3"
      >
        <HeroInput label="Email" name="email" placeholder="example@gmail.com" />

        <PrimaryButton
          centered
          disabled={pending}
          text={'Submit'}
          type="submit"
          size="full"
          datacy="submit-button"
        />
      </Form>

      <Link
        className="font-nunito mt-4 text-center font-bold text-balance underline"
        href="/signin"
      >
        Already Have An Account? Login
      </Link>
    </div>
  );
}

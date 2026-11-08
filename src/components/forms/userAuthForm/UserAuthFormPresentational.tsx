'use client';
import HeroInput from '@/components/inputs/hero/input/HeroInput';
import HeroForm from '../hero/form/HeroForm';
import HeroButton from '@/components/buttons/heroButton/HeroButton';
import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import type { UserAuthFormValues } from '@/lib/schemas/auth/userAuthFormSchema';

export interface UserAuthFormPresentationalProps {
  isSignup: boolean;
  register: UseFormRegister<UserAuthFormValues>;
  handleSubmit: UseFormHandleSubmit<UserAuthFormValues>;
  validationErrors: Record<string, string[]>;
  error?: string;
  onSubmit: SubmitHandler<UserAuthFormValues>;
  pending: boolean;
}

export default function UserAuthFormPresentational({
  isSignup,
  register,
  handleSubmit,
  validationErrors,
  error,
  onSubmit,
  pending,
}: UserAuthFormPresentationalProps) {
  const variant = 'secondary';

  return (
    <HeroForm
      className="flex flex-col gap-4"
      validationBehavior="aria"
      validationErrors={validationErrors}
      onSubmit={handleSubmit(onSubmit)}
    >
      <HeroInput
        variant={variant}
        label="Email"
        type="email"
        placeholder="Email"
        {...register('email')}
      />
      <HeroInput
        variant={variant}
        label="Password"
        type="password"
        placeholder="Password"
        {...register('password')}
      />
      {isSignup && (
        <HeroInput
          variant={variant}
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword')}
        />
      )}
      {error && (
        <p role="alert" className="text-danger text-sm">
          {error}
        </p>
      )}
      <HeroButton
        fullWidth
        type="submit"
        isDisabled={pending}
        className="hover:bg-accent-hover bg-accent text-accent-foreground h-fit rounded-md px-6 py-3 font-bold transition-all duration-300 ease-in-out hover:cursor-pointer"
      >
        {pending ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
      </HeroButton>
    </HeroForm>
  );
}

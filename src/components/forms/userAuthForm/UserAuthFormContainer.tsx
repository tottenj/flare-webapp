'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { signUpAction } from '@/lib/auth/signUpAction';
import signInAction from '@/lib/auth/signInAction';
import { useFormAction } from '@/lib/hooks/useFormAction';
import {
  createUserAuthFormSchema,
  type UserAuthFormValues,
} from '@/lib/schemas/auth/userAuthFormSchema';
import type { ActionResult } from '@/lib/types/responses/ActionResult';

import UserAuthFormPresentational from './UserAuthFormPresentational';
import { extractReactHookFormErrors } from '@/lib/errors/extractReactHookFormErrors';

export default function UserAuthFormContainer({ isSignup }: { isSignup: boolean }) {
  const router = useRouter();
  const schema = createUserAuthFormSchema(isSignup);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserAuthFormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  async function submitAction(values: UserAuthFormValues): Promise<ActionResult<null>> {
    try {
      const [{ auth }, firebaseAuth] = await Promise.all([
        import('@/lib/firebase/auth/configs/clientApp'),
        import('firebase/auth'),
      ]);

      if (isSignup) {
        const { default: firebaseSignUpHelper } = await import('@/lib/auth/firebaseSignUpHelper');
        const { idToken } = await firebaseSignUpHelper(values.email, values.password);
        const result = await signUpAction({ idToken });
        await firebaseAuth.signOut(auth);
        return result;
      }

      const credential = await firebaseAuth.signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const idToken = await credential.user.getIdToken();
      const result = await signInAction({ idToken });

      if (!result.ok && result.error.code === 'UNVERIFIED_EMAIL') {
        await firebaseAuth.sendEmailVerification(credential.user);
        await firebaseAuth.signOut(auth);
      }
      return result;
    } catch (error) {
      return mapFirebaseAuthError(error);
    }
  }

  const {
    action,
    pending,
    error,
    validationErrors: serverValidationErrors,
  } = useFormAction(submitAction, {
    onSuccess: () => {
      if (isSignup) {
        toast.success('Created Account');
        router.push('/confirmation');
        return;
      }
      router.push('/dashboard');
    },
  });

  // Convert React Hook Form errors into HeroForm's format
  const clientValidationErrors = extractReactHookFormErrors(errors);

  // Combine server and client validation errors
  const validationErrors = {
    ...serverValidationErrors,
    ...clientValidationErrors,
  };

  return (
    <UserAuthFormPresentational
      isSignup={isSignup}
      register={register}
      handleSubmit={handleSubmit}
      error={error?.fieldErrors ? undefined : error?.message}
      validationErrors={validationErrors}
      onSubmit={action}
      pending={pending}
    />
  );
}

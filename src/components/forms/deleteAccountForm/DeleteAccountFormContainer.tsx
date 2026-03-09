'use client';
import DeleteAccountFormPresentational from '@/components/forms/deleteAccountForm/DeleteAccountFormPresentational';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { useFormAction } from '@/lib/hooks/useFormAction';
import deleteAccount from '@/lib/serverActions/userActions/deleteAccount/deleteAccount';
import { ActionResult } from '@/lib/types/ActionResult';
import { FirebaseError } from 'firebase/app';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default function DeleteAccountFormContainer() {
  async function onSubmit(formData: FormData): Promise<ActionResult<null>> {
    const email = formData.get('email');
    const password = formData.get('password');
    if (
      !email ||
      typeof email !== 'string' ||
      !password ||
      typeof password !== 'string' ||
      !auth.currentUser
    ) {
      return {
        ok: false,
        error: {
          message: 'Email and password are required.',
          code: 'VALIDATION_ERROR',
        },
      };
    }
    try {
      const cred = EmailAuthProvider.credential(email, password);
      const realCrd = await reauthenticateWithCredential(auth.currentUser, cred);
      const token = await realCrd.user.getIdToken(true);
      const result = await deleteAccount({ idToken: token });
      return result;
    } catch (error) {
      if (error instanceof FirebaseError) {
        return mapFirebaseAuthError(error);
      }
      return {
        ok: false,
        error: {
          message: 'An unexpected error occurred. Please try again later.',
          code: 'UNKNOWN_ERROR',
        },
      };
    }
  }

  const { action, pending, validationErrors, error } = useFormAction(onSubmit, {
    toast: {
      success: 'Account successfully deleted',
      error: 'Failed to delete account. Please try again.',
      loading: 'Deleting account...',
    },
  });

  return (
    <DeleteAccountFormPresentational
      onSubmit={action}
      pending={pending}
      error={error?.message}
      validationErrors={validationErrors}
    />
  );
}

'use client';
import DeleteAccountFormPresentational from '@/components/forms/deleteAccountForm/DeleteAccountFormPresentational';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { useFormAction } from '@/lib/hooks/useFormAction';
import deleteAccount from '@/lib/serverActions/userActions/deleteAccount/deleteAccount';
import { ActionResult } from '@/lib/types/responses/ActionResult';
import { FirebaseError } from 'firebase/app';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  signOut,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function DeleteAccountFormContainer({ onClose }: { onClose?: () => void } = {}) {
  const router = useRouter();
  const [googlePending, setGooglePending] = useState(false);
  const providerIds = auth.currentUser?.providerData.map((provider) => provider.providerId) ?? [];
  const isGoogleOnlyProvider =
    providerIds.includes('google.com') && !providerIds.includes('password');

  async function onDeleteSuccess() {
    try {
      await signOut(auth);
    } catch {
      toast.error('Signed out with server session only. Please sign in again.');
      router.push('/signin');
    }
  }

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

  async function onGoogleReauthDelete() {
    if (!auth.currentUser) {
      toast.error('Please sign in again to continue.');
      return;
    }

    setGooglePending(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await reauthenticateWithPopup(auth.currentUser, provider);
      const token = await cred.user.getIdToken(true);
      const result = await deleteAccount({ idToken: token });

      if (!result.ok) {
        toast.error(result.error.message);
        return;
      }

      toast.success('Account successfully deleted');
      await onDeleteSuccess();
    } catch (error) {
      if (error instanceof FirebaseError) {
        const mapped = mapFirebaseAuthError(error);
        if(!mapped.ok) toast.error(mapped.error.message);
        return;
      }
      toast.error('An unexpected error occurred. Please try again later.');
    } finally {
      setGooglePending(false);
    }
  }

  const { action, pending, validationErrors, error } = useFormAction(onSubmit, {
    toast: {
      success: 'Account successfully deleted',
      error: 'Failed to delete account. Please try again.',
      loading: 'Deleting account...',
    },
    onSuccess: onDeleteSuccess,
  });

  return (
    <DeleteAccountFormPresentational
      onSubmit={action}
      pending={pending || googlePending}
      error={error?.message}
      validationErrors={validationErrors}
      onCancel={onClose}
      useGoogleReauth={isGoogleOnlyProvider}
      onGoogleReauth={onGoogleReauthDelete}
    />
  );
}

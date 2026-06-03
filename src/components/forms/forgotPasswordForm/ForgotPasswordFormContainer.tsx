'use client';

import ForgotPasswordFormPresentational from '@/components/forms/forgotPasswordForm/ForgotPasswordFormPresentational';
import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { auth } from '@/lib/firebase/auth/configs/clientApp';
import { sendPasswordResetEmail } from 'firebase/auth';
import {  useState } from 'react';
import { toast } from 'react-toastify';


export default function ForgotPasswordFormContainer() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

 

  const onSubmit = async (formData: FormData) => {
    setPending(true);
    setError(null);
    const email = formData.get('email') as string;
    if (!email) {
      setError('Email is required');
      setPending(false);
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent! Please check your inbox.');
    } catch (error) {
      const mappedError = mapFirebaseAuthError(error);
      if (!mappedError.ok)
        setError(
          mappedError.error.message || 'Failed to send password reset email. Please try again.'
        );
    } finally {
      setPending(false);
    }
  };

  return (
    <ForgotPasswordFormPresentational
      pending={pending}
      error={error || undefined}
      onSubmit={onSubmit}
    />
  );
}

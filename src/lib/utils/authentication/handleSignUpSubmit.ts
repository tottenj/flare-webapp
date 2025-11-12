'use client';

import newSignUp from '@/lib/firebase/auth/emailPassword/newSignUp';

export default async function handleSignUpSubmit(
  e: React.FormEvent<HTMLFormElement>,
  accountType: string
) {
  const formData = new FormData(e.currentTarget);
  formData.append('account_type', accountType);
  try {
    return await newSignUp(formData);
  } catch (err: any) {
    sessionStorage.removeItem('manualLoginInProgress');
    throw err;
  }
}

// hooks/useActionToast.ts
'use client';

import { useEffect, useRef } from 'react';
import { toast, Id } from 'react-toastify';

interface ActionToastOptions {
  successMessage?: string;
  loadingMessage?: string;
}

export function useActionToast<T extends { message?: string }>(
  state: T,
  pending: boolean,
  { successMessage = 'Success!', loadingMessage = 'Processing...' }: ActionToastOptions = {}
) {
  const toastId = useRef<Id | null>(null);

  useEffect(() => {
    if (pending && !toastId.current) {
      toastId.current = toast.loading(loadingMessage);
    }
  }, [pending, loadingMessage]);

  useEffect(() => {
    if (!pending && state?.message) {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      if (state.message === 'User created successfully') {
        toast.success(successMessage);
      } else {
        toast.error(state.message);
      }
    }
  }, [pending, state, successMessage]);
}

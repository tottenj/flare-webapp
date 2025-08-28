// hooks/useActionToast.ts
'use client';

import { ActionResponse } from '@/lib/types/ActionResponse';
import { useEffect, useRef } from 'react';
import { toast, Id } from 'react-toastify';

interface ActionToastOptions {
  successMessage?: string;
  loadingMessage?: string;
}

export function useFormAction(
  state: ActionResponse,
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
    if (!pending && state.status) {
      if (toastId.current) {
        toast.dismiss(toastId.current);
        toastId.current = null;
      }

      if (state.status === 'success') {
        toast.success(state.message || successMessage);
      } else if (state.status === 'error') {
        // errors object available here if needed
        const errMsg = state.message || 'Something went wrong';
        toast.error(errMsg);
      }
    }
  }, [pending, state, successMessage]);
}

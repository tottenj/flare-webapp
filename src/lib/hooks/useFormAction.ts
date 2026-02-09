import { useCallback, useRef, useState } from 'react';
import type { ActionError, ActionResult } from '@/lib/types/ActionResult';
import { toast, Id } from 'react-toastify';

type ToastMessages = {
  loading?: string;
  success?: string;
  error?: string;
};

type UseFormActionOptions<T> = {
  toast?: ToastMessages;
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: ActionError) => void;
};

export function useFormAction<T>(
  actionFn: (formData: FormData) => Promise<ActionResult<T>>,
  options?: UseFormActionOptions<T>
) {
  const onSuccess = options?.onSuccess;
  const onError = options?.onError;
  const loadingMsg = options?.toast?.loading;
  const successMsg = options?.toast?.success;
  const errorMsg = options?.toast?.error;

  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ActionError | null>(null);
  const toastId = useRef<Id | undefined>(undefined);

  const action = useCallback(
    async (formData: FormData) => {
      setError(null);
      setPending(true);
      if (loadingMsg) {
        toastId.current = toast.loading(loadingMsg);
      }

      try {
        const result = await actionFn(formData);

        if (!result.ok) {
          setError(result.error);
          if (errorMsg) {
            if (toastId.current) {
              toast.update(toastId.current, {
                render: errorMsg,
                type: 'error',
                isLoading: false,
                autoClose: 4000,
              });
            } else {
              toast.error(errorMsg);
            }
          }
          onError?.(result.error);
          return;
        }
        if (successMsg) {
          if (toastId.current) {
            toast.update(toastId.current, {
              render: successMsg,
              type: 'success',
              isLoading: false,
              autoClose: 3000,
            });
          } else {
            toast.success(successMsg);
          }
        }
        await options?.onSuccess?.(result.data);
      } finally {
        setPending(false);
        toastId.current = undefined;
      }
    },
    [actionFn, loadingMsg, successMsg, errorMsg, onSuccess, onError]
  );

  return {
    action,
    pending,
    error,
    validationErrors: error?.fieldErrors,
    clearError: () => setError(null),
  };
}

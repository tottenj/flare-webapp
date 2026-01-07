import { useCallback, useState } from 'react';
import type { ActionError, ActionResult } from '@/lib/types/ActionResult';


type UseFormActionOptions<T> = {
  onSuccess?: (data: T) => void | Promise<void>;
  onError?: (error: ActionError) => void;
};

export function useFormAction<T>(
  actionFn: (formData: FormData) => Promise<ActionResult<T>>,
  options?: UseFormActionOptions<T>
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<ActionError | null>(null);

  const action = useCallback(
    async (formData: FormData) => {
      setError(null);
      setPending(true);

      try {
        const result = await actionFn(formData);

        if (!result.ok) {
          setError(result.error);
          options?.onError?.(result.error);
          return;
        }

        await options?.onSuccess?.(result.data);
      } finally {
        setPending(false);
      }
    },
    [actionFn, options]
  );

  return {
    action, // pass to <Form action={...}>
    pending, // disable submit / show spinner
    error, // global + field errors
    validationErrors: error?.fieldErrors, 
    clearError: () => setError(null),
  };
}

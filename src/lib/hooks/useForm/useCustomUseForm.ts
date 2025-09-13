import { useActionState, useEffect } from 'react';
import { useFormAction } from './useFormAction';
import { ActionResponse } from '@/lib/types/ActionResponse';

export default function useCustomUseForm(
  actionFn: (prevState: ActionResponse, formData: FormData) => Promise<ActionResponse>,
  successMes?: string,
  loadingMes?: string,
  close: () => void = () => {}
) {
  const initialState: ActionResponse = { status: undefined, message: '', errors: {} };
  const wrappedAction = (state: ActionResponse, formData: FormData): Promise<ActionResponse> =>
    actionFn(state, formData);

  const [state, action, pending] = useActionState<ActionResponse>(
    wrappedAction as (state: ActionResponse, ...args: any[]) => Promise<ActionResponse>,
    initialState
  );

  useFormAction(state, pending, {
    successMessage: successMes || 'Success',
    loadingMessage: loadingMes || 'Loading...',
  });

  useEffect(() => {
    if (state.status === 'success' && !pending) {
      close();
    }
  }, [pending, state, close]);

  return { action, pending, state };
}

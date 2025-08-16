import { useActionState, useEffect } from 'react';
import { useFormAction } from './useFormAction';


export default function useCustomUseForm(
  actions: any,
  successMes?: string,
  loadingMes?: string,
  close: () => void = () => {}
) {
  const initialState = { status: '', errors: {} };
  const [state, action, pending] = useActionState(actions, initialState);

  useFormAction(state.status, pending, {
    successMessage: successMes || 'Success',
    loadingMessage: loadingMes || 'Loading...',
  });

  useEffect(() => {
    if (state.status === 'success' && !pending) {
      close();
    }
  }, [pending, state]);

  return { action, pending, state };
}

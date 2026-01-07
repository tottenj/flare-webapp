// src/hooks/useActionError.ts
import { useState } from 'react';
import { ActionError } from '../types/ActionResult';

export function useActionError() {
  const [error, setError] = useState<ActionError | null>(null);

  function handleResult<T>(result: { ok: boolean; error?: ActionError }): boolean {
    if (!result.ok && result.error) {
      setError(result.error);
      return false;
    }
    return true;
  }

  function clearError() {
    setError(null);
  }

  return {
    error,
    setError,
    clearError,
    handleResult,
  };
}

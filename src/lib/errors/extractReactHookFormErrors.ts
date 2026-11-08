import type { FieldErrors, FieldValues } from 'react-hook-form';

export function extractReactHookFormErrors<T extends FieldValues>(
  errors: FieldErrors<T>
): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};

  for (const [key, value] of Object.entries(errors)) {
    if (value?.message) {
      fieldErrors[key] = [String(value.message)];
    }
  }

  return fieldErrors;
}

import { ZodError } from "zod";

export function zodFieldErrors(error: ZodError) {
  const formatted = error.format();
  const fieldErrors: Record<string, string[]> = {};

  for (const key of Object.keys(formatted)) {
    if (key === '_errors') continue; // skip global errors
    const entry = (formatted as any)[key];
    if (entry?._errors?.length) {
      fieldErrors[key] = entry._errors;
    }
  }

  return fieldErrors;
}

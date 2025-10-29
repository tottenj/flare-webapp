import { z, ZodError } from 'zod';

export function convertFormData<T extends z.ZodTypeAny>(
  schema: T,
  input: Record<string, any>
): { success: true; data: z.infer<T> } | { success: false; error: ZodError } {
  const data = Object.fromEntries(input.entries());
  

  const merged = {
    ...data,
  };
  const result = schema.safeParse(merged);

  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

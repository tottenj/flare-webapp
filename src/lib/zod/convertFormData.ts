import { z, ZodObject, ZodRawShape, ZodError } from 'zod';
import { handleLocationSchema } from '../utils/other/handleLocationSchema';

export function convertFormData<T extends z.ZodTypeAny>(
  schema: T,
  input: Record<string, any>
): { success: true; data: z.infer<T> } | { success: false; error: ZodError } {
  const data = Object.fromEntries(input.entries());
  const loc = handleLocationSchema(data);

  const merged = {
    ...data,
    ...(loc ? { location: loc } : {}),
  };
  const result = schema.safeParse(merged);

  return result.success
    ? { success: true, data: result.data }
    : { success: false, error: result.error };
}

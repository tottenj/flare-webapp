import { z } from 'zod';

export function parseFormData<TSchema extends z.ZodTypeAny>(formData: FormData, schema: TSchema) {
  const obj: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    obj[key] = typeof value === 'string' ? value : value.name;
  }

  return schema.safeParse(obj);
}

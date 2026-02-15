import z from 'zod';
import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import { CreateEventBaseSchema } from '@/lib/schemas/event/eventBaseSchema';

export const CreateEventPreviewFormSchema = CreateEventBaseSchema.extend({
  location: z.preprocess((val) => JSON.parse(val as string), LocationInputSchema.nullable()).optional(),
  tags: z.preprocess((val) => JSON.parse(val as string), z.array(z.string())),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
});

export type CreateEventPreviewForm = z.infer<typeof CreateEventPreviewFormSchema>;
export function parsePreviewFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return CreateEventPreviewFormSchema.safeParse(raw);
}

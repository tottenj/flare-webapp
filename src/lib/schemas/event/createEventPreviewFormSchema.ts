import z from 'zod';
import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import { CreateEventBaseSchema } from '@/lib/schemas/event/eventBaseSchema';
import { parseZonedDateTime } from '@internationalized/date';

export const CreateEventPreviewFormSchema = CreateEventBaseSchema.extend({
  location: z
    .preprocess((val) => JSON.parse(val as string), LocationInputSchema.nullable())
    .optional(),
  tags: z.preprocess((val) => JSON.parse(val as string), z.array(z.string())),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
})
  .superRefine((data, ctx) => {
    if (!data.endDateTime) return;

    try {
      const start = parseZonedDateTime(data.startDateTime);
      const end = parseZonedDateTime(data.endDateTime);
      if (end.toDate().getTime() <= start.toDate().getTime()) {
        ctx.addIssue({
          code: 'custom',
          path: ['endDateTime'],
          message: 'End date/time must be after the start date/time',
        });
      }
    } catch {
      ctx.addIssue({
        code: 'custom',
        path: ['endDateTime'],
        message: 'Invalid end date/time',
      });
    }
  }).strip();

export type CreateEventPreviewForm = z.infer<typeof CreateEventPreviewFormSchema>;
export function parsePreviewFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return CreateEventPreviewFormSchema.safeParse(raw);
}

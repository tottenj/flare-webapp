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
    if (data.endDateTime) {
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
    }
    const { priceType, minPrice, maxPrice } = data;
    const hasMin = minPrice !== undefined && !Number.isNaN(minPrice);
    const hasMax = maxPrice !== undefined && !Number.isNaN(maxPrice);

    if (priceType === 'FREE') {
      if (hasMin || hasMax) {
        ctx.addIssue({
          code: 'custom',
          path: ['minPrice'],
          message: 'Free events cannot have a price',
        });
      }
    }


    if (priceType === 'FIXED') {
      if (!hasMin) {
        ctx.addIssue({
          code: 'custom',
          path: ['minPrice'],
          message: 'Fixed price events require a price',
        });
      }

      if (hasMax && maxPrice !== minPrice) {
        ctx.addIssue({
          code: 'custom',
          path: ['maxPrice'],
          message: 'Fixed price events should not include a max price',
        });
      }
    }

    if (priceType === 'RANGE') {
      if (!hasMin) {
        ctx.addIssue({
          code: 'custom',
          path: ['minPrice'],
          message: 'Range pricing requires a minimum price',
        });
      }

      if (!hasMax) {
        ctx.addIssue({
          code: 'custom',
          path: ['maxPrice'],
          message: 'Range pricing requires a maximum price',
        });
      }

      if (hasMin && hasMax && maxPrice < minPrice) {
        ctx.addIssue({
          code: 'custom',
          path: ['maxPrice'],
          message: 'Maximum price must be greater than or equal to minimum price',
        });
      }
    }

    if (priceType === 'PWYC') {
      if (hasMax) {
        ctx.addIssue({
          code: 'custom',
          path: ['maxPrice'],
          message: 'Pay What You Can events cannot have a maximum price',
        });
      }
    }
  })
  .strip();

export type CreateEventPreviewForm = z.infer<typeof CreateEventPreviewFormSchema>;
export function parsePreviewFormData(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  return CreateEventPreviewFormSchema.safeParse(raw);
}

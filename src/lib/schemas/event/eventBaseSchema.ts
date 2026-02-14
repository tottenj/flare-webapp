import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import { ZonedDateTimeString } from '@/lib/schemas/zodSchemaAdditions';
import { AGE_RANGE_VALUES } from '@/lib/types/AgeRange';
import { PRICE_TYPE_VALUES } from '@/lib/types/PriceType';
import { EventCategory } from '@prisma/client';
import z from 'zod';

export const CreateEventBaseSchema = z.object({
  eventName: z.string().min(1),
  eventDescription: z.string().min(1),
  category: z.enum(EventCategory),

  location: LocationInputSchema,
  tags: z.array(z.string()),

  startDateTime: ZonedDateTimeString,
  endDateTime: ZonedDateTimeString.optional(),

  ageRestriction: z.enum(AGE_RANGE_VALUES),
  priceType: z.enum(PRICE_TYPE_VALUES),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
});

export type CreateEventBase = z.infer<typeof CreateEventBaseSchema>;

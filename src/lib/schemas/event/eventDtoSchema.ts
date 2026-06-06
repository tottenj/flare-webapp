import { AGE_RANGE_VALUES } from '@/lib/types/AgeRange';
import { PRICE_TYPE_VALUES } from '@/lib/types/PriceType';
import { EventCategory } from '../../../../prisma/generated/enums';
import z from 'zod';

export const eventDtoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  category: z.enum(EventCategory),
  ageRestriction: z.enum(AGE_RANGE_VALUES),
  status: z.enum(['DRAFT', 'PUBLISHED']),
  imagePath: z.string().nullable(),
  startsAt: z.string(),
  endsAt: z.string().nullable(),
  timezone: z.string(),
  organization: z.object({
    id: z.string(),
    name: z.string(),
  }),
  viewer: z
    .object({
      isSaved: z.boolean(),
    })
    .optional(),
  location: z.object({
    address: z.string().nullable(),
    placeId: z.string().nullable(),
  }),
  pricing: z.object({
    type: z.enum(PRICE_TYPE_VALUES),
    minCents: z.number().int().nullable(),
    maxCents: z.number().int().nullable(),
  }),
  tags: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
    })
  ),
  ticketLink: z.url().nullable(),
});

export type EventDto = z.infer<typeof eventDtoSchema>;

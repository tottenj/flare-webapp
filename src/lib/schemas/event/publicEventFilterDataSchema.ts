import { LocationInputSchema } from '@/lib/schemas/LocationInputSchema';
import z from 'zod';

export const publicEventFilterDataSchema = z.object({
  location: LocationInputSchema.optional(),
});

export type PublicEventFilterData = z.infer<typeof publicEventFilterDataSchema>;

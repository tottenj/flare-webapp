import { z } from 'zod';

export const LocationInputSchema = z.object({
  placeId: z.string().min(1),
  address: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
}).strict();

export type LocationInput = z.infer<typeof LocationInputSchema>;

import { z } from 'zod';

export const EventModalSearchParamsSchema = z.object({
  returnTo: z.string().startsWith('/').optional(),
});


export type EventModalSearchParams = z.infer<typeof EventModalSearchParamsSchema>;
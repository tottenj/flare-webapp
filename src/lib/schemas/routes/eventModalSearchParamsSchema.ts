import { z } from 'zod';
import { ReturnToSchema } from '@/lib/schemas/routes/returnToSchema';

export const EventModalSearchParamsSchema = z.object({
  returnTo: ReturnToSchema,
});

export type EventModalSearchParams = z.infer<typeof EventModalSearchParamsSchema>;

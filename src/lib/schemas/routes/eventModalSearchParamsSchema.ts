import { z } from 'zod';

export const EventModalSearchParamsSchema = z.object({
  returnTo: z.string().startsWith('/').optional(),
});

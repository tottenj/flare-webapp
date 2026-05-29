import { z } from 'zod';
import { ReturnToSchema } from '@/lib/schemas/routes/returnToSchema';

export const BaseModalSearchParamsSchema = z.object({
  returnTo: ReturnToSchema,
});

export type BaseModalSearchParams = z.infer<typeof BaseModalSearchParamsSchema>;

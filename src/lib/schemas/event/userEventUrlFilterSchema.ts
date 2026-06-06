import { EventCategory } from '#prisma/generated/enums';
import z from 'zod';

export const UserEventUrlFilterSchema = z.object({
  category: z.enum(EventCategory).optional(),
  placeId: z.string().optional(),
  distance: z.coerce.number().min(10).max(100).optional(),
});

export type UserEventUrlFilter = z.infer<typeof UserEventUrlFilterSchema>;

import z from "zod";
import { EventCategory } from '#prisma/generated/enums';

export const userEventFilterSchema = z.object({
    placeId: z.string().optional(),
    category: z.enum(EventCategory).optional(),
    distance: z.number().min(10).max(100).optional(),
})

export type UserEventFilter = z.infer<typeof userEventFilterSchema>;
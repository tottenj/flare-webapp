import z from "zod";

export const userEventFilterSchema = z.object({
    placeId: z.string().optional()
})

export type UserEventFilter = z.infer<typeof userEventFilterSchema>;
import z from "zod";

export const createLocationSchema = z.object({
    place_id: z.string(),
    name:  z.string().optional(),
    coordinates: z.object({lat: z.coerce.number().min(-90).max(90), lng: z.coerce.number().min(-180).max(180)})
})

export type createLocation = z.infer<typeof createLocationSchema>
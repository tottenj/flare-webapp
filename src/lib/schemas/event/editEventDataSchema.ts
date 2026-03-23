import { LocationInputSchema } from "#src/lib/schemas/LocationInputSchema.js";
import { ImageMetadataSchema } from "#src/lib/schemas/proof/ImageMetadata.js";
import z from "zod";

export const editEventDataSchema = z.object({
    location: LocationInputSchema,
    imageUrl: z.string().optional(),
    imageMetadata: ImageMetadataSchema
})

export type EditEventData = z.infer<typeof editEventDataSchema>;
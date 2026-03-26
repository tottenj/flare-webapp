
import { LocationInputSchema } from "@/lib/schemas/LocationInputSchema";
import { ImageMetadataSchema } from "@/lib/schemas/proof/ImageMetadata";
import z from "zod";

export const editEventDataSchema = z.object({
    location: LocationInputSchema.optional(),
    imageUrl: z.string().optional(),
    imageMetadata: ImageMetadataSchema.optional()
})

export type EditEventData = z.infer<typeof editEventDataSchema>;
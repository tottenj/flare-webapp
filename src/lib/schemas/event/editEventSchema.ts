import { LocationInputSchema } from "@/lib/schemas/LocationInputSchema";
import { ImageMetadataSchema } from "@/lib/schemas/proof/ImageMetadata";
import z from "zod";

export const editEventSchema = z.object({
    eventTitle: z.string(),
    eventDescription: z.string(),
    location: LocationInputSchema.optional(),
    imageData: z.object({
        url: z.string(),
        metaData: ImageMetadataSchema
    }).optional(),
    
  
})
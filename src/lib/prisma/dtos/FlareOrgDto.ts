import z from "zod";
import { createLocationSchema } from "./LocationDto";
import { createSocialsSchema } from "./SocialsDto";

export const createOrgDBSchema = z.object({
    description: z.string().optional(),
    location: createLocationSchema,
    socials: createSocialsSchema.optional()
})

export type createOrgDtoType = z.infer<typeof createOrgDBSchema>



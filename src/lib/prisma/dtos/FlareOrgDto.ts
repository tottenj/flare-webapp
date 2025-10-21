import z from "zod";
import { createLocationSchema } from "./LocationDto";
import { createSocialsSchema } from "./SocialsDto";

export const createOrgDbSchema = z.object({
    description: z.string().optional(),
    location: createLocationSchema,
    socials: createSocialsSchema.optional()
})

export type createOrgDb = z.infer<typeof createOrgDbSchema>
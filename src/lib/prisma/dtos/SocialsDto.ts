import z from "zod";

export const createSocialsSchema = z.object({
    twitter: z.string().optional(),
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    other: z.string().optional()
})

export type createSocials = z.infer<typeof createSocialsSchema>
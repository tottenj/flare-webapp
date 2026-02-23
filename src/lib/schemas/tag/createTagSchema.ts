import z from "zod"

export const createTagSchema = z.object({
    label: z.string().min(2)
})

export type CreateTag = z.infer<typeof createTagSchema>
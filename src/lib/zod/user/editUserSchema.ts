import z from "zod";

export const EditUserSchema = z.object({
    name: z.string()
})
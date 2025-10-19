import z from "zod";

export const CreateDbUserSchema = z.object({
  email: z.string(),
  account_type: z.enum(['user', 'org']),
})

// Infer the TS type from Zod
export type CreateUserDto = z.infer<typeof CreateDbUserSchema>;

import z from "zod";

export const AuthTokenSchema = z.object({
  idToken: z.string(),
});

export type AuthTokenInput = z.infer<typeof AuthTokenSchema>;

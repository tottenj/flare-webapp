import z from "zod";


export const SignUpSchema = z.object({
  idToken: z.string(),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

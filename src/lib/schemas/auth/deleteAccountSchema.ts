import z from 'zod';

export const deleteAccountSchema = z.object({
  idToken: z.string().min(10),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
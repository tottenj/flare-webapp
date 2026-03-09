import z, { email } from 'zod';

export const deleteAccountSchema = z.object({
  idToken: z.string(),
});

export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
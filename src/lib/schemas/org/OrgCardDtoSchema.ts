import z from 'zod';

export const OrgCardSchema = z.object({
  id: z.string(),
  orgName: z.string(),
  location: z.string().nullable(),
  profilePicPath: z.string().nullable(),
});

export type OrgCardDto = z.infer<typeof OrgCardSchema>;

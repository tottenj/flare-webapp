import z from "zod";

export const GetOrgProfileSchema = z.object({
  id: z.string(),
  orgName: z.string(),
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED']),
  locationId: z.string()
});

export type GetOrgProfile = z.infer<typeof GetOrgProfileSchema>;

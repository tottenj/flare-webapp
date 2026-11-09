import { OrgStatus } from '#prisma/generated/enums';
import z from 'zod';

export const GetOrgProfileSchema = z.object({
  id: z.string(),
  orgName: z.string(),
  status: z.enum(OrgStatus),
  locationId: z.string().nullable(),
});

export type GetOrgProfile = z.infer<typeof GetOrgProfileSchema>;

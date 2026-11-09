import { GetOrgProfileSchema } from '@/lib/schemas/userContext/GetOrgProfileSchema';
import { OrganizationMemberRole } from '#prisma/generated/enums';
import z from 'zod';

const OrganizationMembershipSchema = z.object({
  role: z.enum(OrganizationMemberRole),
  organization: GetOrgProfileSchema,
});

export const GetUserContextSchema = z.object({
  user: z.object({
    id: z.string(),
    firebaseUid: z.string(),
    email: z.string().email(),
    role: z.enum(['USER', 'ADMIN']),
    emailVerified: z.boolean(),
    profilePic: z.string().nullable(),
  }),
  organizationMemberships: z.array(OrganizationMembershipSchema),
  flags: z.object({
    isAuthenticated: z.literal(true),
    isAdmin: z.boolean(),
  }),
});

export type GetUserContext = z.infer<typeof GetUserContextSchema>;

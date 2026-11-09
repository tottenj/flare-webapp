import { GetOrgProfileSchema } from '@/lib/schemas/userContext/GetOrgProfileSchema';
import { OrganizationMemberRole, UserRole } from '#prisma/generated/enums';
import z from 'zod';

export const GetUserContextSchema = z.object({
  user: z.object({
    id: z.string(),
    firebaseUid: z.string(),
    email: z.email(),
    role: z.enum(UserRole),
    emailVerified: z.boolean(),
    profilePic: z.string().nullable(),
  }),
  organizationMemberships: z.array(
    z.object({
      role: z.enum(OrganizationMemberRole),
      organization: GetOrgProfileSchema,
    })
  ),
  flags: z.object({
    isAuthenticated: z.literal(true),
    isAdmin: z.boolean(),
  }),
});

export type GetUserContext = z.infer<typeof GetUserContextSchema>;

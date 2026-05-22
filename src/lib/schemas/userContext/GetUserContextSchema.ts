import { GetOrgProfileSchema } from '@/lib/schemas/userContext/GetOrgProfileSchema';
import { UserRole } from '#prisma/generated/enums';
import z from 'zod';

export const GetUserContextSchema = z.object({
  user: z.object({
    id: z.string(),
    firebaseUid: z.string(),
    email: z.string().email(),
    role: z.enum(UserRole),
    emailVerified: z.boolean(),
    profilePic: z.string().nullable()
  }),
  profile: z.object({
    orgProfile: GetOrgProfileSchema.nullable(),
  }),
  flags: z.object({
    isAuthenticated: z.literal(true),
    isOrg: z.boolean(),
    isOrgVerified: z.boolean(),
    isAdmin: z.boolean(),
  }),
});



export type GetUserContext = z.infer<typeof GetUserContextSchema>;

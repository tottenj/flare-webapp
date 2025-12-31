import getAuthenticatedUser from '@/lib/auth/utils/getAuthenticatedUser';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { UserDomain } from '@/lib/domain/UserDomain';
import {
  GetUserContext,
  GetUserContextSchema,
} from '@/lib/schemas/userContext/GetUserContextSchema';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export class UserContextService {
  private static resolve = cache(async (): Promise<GetUserContext | null> => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return null;
    const user = await userDal.findContextByFirebaseUid(authUser.uid);
    if (!user) return null;

    const isOrg = !!user.organizationProfile;
    const isOrgVerified = user.organizationProfile?.status === 'VERIFIED';
    const isAdmin = user.role === 'ADMIN';

    const ctx: GetUserContext = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        emailVerified: authUser.emailVerified,
        profilePic: user.profilePic ? UserDomain.profilePicturePath(authUser.uid) : null,
      },
      profile: {
        orgProfile: user.organizationProfile
          ? {
              id: user.organizationProfile.id,
              orgName: user.organizationProfile.orgName,
              status: user.organizationProfile.status,
              locationId: user.organizationProfile.locationId,
            }
          : null,
      },
      flags: {
        isAuthenticated: true,
        isOrg,
        isOrgVerified,
        isAdmin,
      },
    };

    GetUserContextSchema.parse(ctx);
    return ctx;
  });

  static async requireUser(): Promise<GetUserContext> {
    const ctx = await this.resolve();
    if (!ctx) redirect('/signin');
    return ctx;
  }

  static async requireOrg(): Promise<GetUserContext> {
    const ctx = await this.requireUser();
    if (!ctx.flags.isOrg) redirect('/dashboard');
    return ctx;
  }

  static async requireVerifiedOrg(): Promise<GetUserContext> {
    const ctx = await this.requireOrg();
    if (!ctx.flags.isOrgVerified) redirect('/org/pending');
    return ctx;
  }
}

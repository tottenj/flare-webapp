import getAuthenticatedUser from '@/lib/auth/utils/getAuthenticatedUser';
import { userDal } from '@/lib/dal/userDal/UserDal';
import {
  GetUserContext,
  GetUserContextSchema,
} from '@/lib/schemas/userContext/GetUserContextSchema';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type OrgUserContext = GetUserContext & {
  profile: {
    orgProfile: NonNullable<GetUserContext['profile']['orgProfile']>;
  };
  flags: {
    isOrg: true;
  };
};


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
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role,
        emailVerified: authUser.emailVerified,
        profilePic: user.profilePic?.imageAsset?.storagePath ?? null,
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

  static async requireNone(): Promise<GetUserContext | null> {
    return await this.resolve();
  }

  static async requireUser(): Promise<GetUserContext> {
    const ctx = await this.resolve();
    if (!ctx) redirect('/signin');
    return ctx;
  }

  static async requireOrg(): Promise<OrgUserContext> {
    const ctx = await this.requireUser();
    if (!ctx.flags.isOrg || !ctx.profile.orgProfile) redirect('/dashboard');
    return ctx as OrgUserContext;
  }

  static async requireVerifiedOrg(): Promise<GetUserContext> {
    const ctx = await this.requireOrg();
    if (!ctx.flags.isOrgVerified) redirect('/org/pending');
    return ctx;
  }
}

import getAuthenticatedUser from '@/lib/auth/utils/getAuthenticatedUser';
import { userDal } from '@/lib/dal/userDal/UserDal';
import {
  GetUserContext,
  GetUserContextSchema,
} from '@/lib/schemas/userContext/GetUserContextSchema';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { redirect } from 'next/navigation';
import { cache } from 'react';

export type OrganizationMembership = GetUserContext['organizationMemberships'][number];

export class UserContextService {
  private static resolve = cache(async (): Promise<GetUserContext | null> => {
    const authUser = await getAuthenticatedUser();
    if (!authUser) return null;
    const user = await userDal.findContextByFirebaseUid(authUser.uid);
    if (!user) return null;

    const isAdmin = user.role === 'ADMIN';

    return GetUserContextSchema.parse({
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        role: user.role,
        emailVerified: authUser.emailVerified,
        profilePic: user.profilePic?.imageAsset?.storagePath ?? null,
      },
      organizationMemberships: user.organizationMemberships,
      flags: {
        isAuthenticated: true,
        isAdmin,
      },
    });
  });

  static async requireNone(): Promise<GetUserContext | null> {
    return await this.resolve();
  }

  static async requireUser(): Promise<GetUserContext> {
    const ctx = await this.resolve();
    if (!ctx) redirect('/signin');
    return ctx;
  }

  static async requireOrg(organizationId: string) {
    const ctx = await this.requireUser();
    const membership = this.getMembership(ctx, organizationId);

    if (!membership) redirect('/dashboard');

    return { ctx, membership };
  }

  static async requireAdmin(): Promise<GetUserContext> {
    const ctx = await this.requireUser();
    if (!ctx.flags.isAdmin) redirect('/');
    return ctx;
  }

  static getMembership(ctx: GetUserContext, organizationId: string) {
    return ctx.organizationMemberships.find(
      ({ organization }) => organization.id === organizationId
    );
  }

  static getOrgActor(
    ctx: GetUserContext,
    membership: OrganizationMembership
  ): AuthenticatedOrganization {
    return {
      ...this.getUserActor(ctx),
      orgId: membership.organization.id,
    };
  }

  static getUserActor(ctx: GetUserContext): AuthenticatedUser {
    return {
      userId: ctx.user.id,
      firebaseUid: ctx.user.firebaseUid,
    };
  }
}

import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { AppError } from '@/lib/errors/AppError';
import { AuthErrors } from '@/lib/errors/authError';
import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';
import { mapAdminOrgRowToDto } from '@/lib/types/dto/admin/AdminOrgDetailsDto';
import { mapOrgCardRowToDto } from '@/lib/types/dto/org/OrgCardDto';

export class AdminService {
  private static async assertAdmin(actor: AuthenticatedUser) {
    const user = await userDal.findByFirebaseUid(actor.firebaseUid);
    if (!user?.role || user.role !== 'ADMIN') throw AuthErrors.Unauthorized();
  }

  static async getUnverifiedOrgCards(actor: AuthenticatedUser) {
    await this.assertAdmin(actor);
    const cards = await orgProfileDal.getAdminOrgCards();
    return cards.map(mapOrgCardRowToDto);
  }

  static async getUnverifiedOrgDetails(actor: AuthenticatedUser, orgId: string) {
    await this.assertAdmin(actor);
    const details = await orgProfileDal.getAdminOrgDetails(orgId);
    if (!details) return null;
    return mapAdminOrgRowToDto(details);
  }

  static async verifyOrg(actor: AuthenticatedUser, orgId: string) {
    await this.assertAdmin(actor);
    const wasVerified = await orgProfileDal.verifyOrg(orgId);
    if (!wasVerified) {
      throw new AppError({
        code: 'ORG_NOT_PENDING_OR_NOT_FOUND',
        clientMessage: 'Organization is no longer pending verification.',
        status: 409,
      });
    }
  }
}

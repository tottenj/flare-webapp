import { AuthService } from '@/lib/services/authService/AuthService';
import { prisma } from '../../../prisma/prismaClient';
import { OrgProfileService } from '@/lib/services/orgProfileService.ts/orgProfileService';
import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';


/**
 * signUpOrgUseCase
 *
 * Throws:
 * - AppError (known business failures)
 * - RequiresCleanupError (external side effects must be rolled back)
 * - Error (unexpected)
 */
export default async function signUpOrgUseCase(data: OrgSignUpInput) {
  await prisma.$transaction(async (tx) => {
    await AuthService.signUp({ idToken: data.idToken }, tx);
    await OrgProfileService.signup(data, tx);
  });
}

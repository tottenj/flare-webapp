import AuthGateway from '@/lib/auth/authGateway';
import { AppError } from '@/lib/errors/AppError';
import { AuthErrors } from '@/lib/errors/authError';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { logger } from '@/lib/logger';
import { OrgSignUpInput, OrgSignUpSchema } from '@/lib/schemas/auth/orgSignUpSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import z from 'zod';
import signUpOrgUseCase from '@/lib/useCase/signUpOrgUseCase';

export async function orgSignUpAction(input: OrgSignUpInput): Promise<ActionResult<null>> {
  const data = OrgSignUpSchema.safeParse(input);
  if (!data.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(data.error));
    return fail(AuthErrors.InvalidInput(), fieldErrors);
  }
  try {
    await signUpOrgUseCase(data.data);
    return { ok: true, data: null };
  } catch (err) {
    if (err instanceof RequiresCleanupError) {
      await AuthGateway.deleteUser(err.firebaseUid).catch((cleanupErr) => {
        logger.error('Failed to cleanup Firebase user', {
          firebaseUid: err.firebaseUid,
          cleanupErr,
        });
      });
    }
    if (err instanceof AppError) {
      return fail(err);
    }
    logger.error('orgSignUpAction failed', {
      err,
      input: { email: data.data.idToken },
    });
    return fail(
      new AppError({
        code: 'UNKNOWN',
        clientMessage: 'Something went wrong. Please try again.',
      })
    );
  }
}

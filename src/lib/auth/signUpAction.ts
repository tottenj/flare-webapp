'use server';
import z from 'zod';
import { AppError } from '../errors/AppError';
import { AuthErrors } from '../errors/authError';
import fail from '../errors/fail';
import { AuthTokenSchema } from '../schemas/signUpSchema';
import { ActionResult } from '../types/ActionResult';
import { extractFieldErrors } from '../errors/extractError';
import { logger } from '../logger';
import { AuthService } from '../services/authService/AuthService';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
import AuthGateway from '@/lib/auth/authGateway';

export async function signUpAction(input: unknown): Promise<ActionResult<null>> {
  const data = AuthTokenSchema.safeParse(input);

  if (!data.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(data.error));
    return fail(AuthErrors.InvalidInput(), fieldErrors);
  }

  try {
    await AuthService.signUp(data.data);
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
    
    logger.error('signUpAction failed', {
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

'use server';
import z from 'zod';
import { AuthErrors } from '../errors/authError';
import { extractFieldErrors } from '../errors/extractError';
import { ActionResult } from '../types/ActionResult';
import fail from '../errors/fail';
import { AuthService } from '../services/authService/AuthService';
import { AppError } from '../errors/AppError';
import { logger } from '../logger';
import { cookies } from 'next/headers';
import { AuthTokenSchema } from '../schemas/auth/signUpSchema';

export default async function signInAction(input: unknown): Promise<ActionResult<null>> {
  const data = AuthTokenSchema.safeParse(input);
  if (!data.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(data.error));
    return fail(AuthErrors.InvalidInput(), fieldErrors);
  }

  try {
    const { sessionToken } = await AuthService.signIn(data.data);
    const cookie = await cookies();
    cookie.set('session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });
    return { ok: true, data: null };
  } catch (err) {
    if (err instanceof AppError) {
      return fail(err);
    }
    logger.error('signInAction failed', {
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

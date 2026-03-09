'use server';

import AuthGateway from '@/lib/auth/authGateway';
import { AppError } from '@/lib/errors/AppError';
import { AuthErrors } from '@/lib/errors/authError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { DeleteAccountInput, deleteAccountSchema } from '@/lib/schemas/auth/deleteAccountSchema';
import AccountService from '@/lib/services/accountService/AccountService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/ActionResult';
import z from 'zod';

export default async function deleteAccount(
  input: DeleteAccountInput
): Promise<ActionResult<null>> {
  const sanitized = deleteAccountSchema.safeParse(input);
  if (!sanitized.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
    return fail(AuthErrors.SigninFailed(), fieldErrors);
  }
  const ctx = await UserContextService.requireUser();

  try {
    const token = await AuthGateway.verifyIdToken(sanitized.data.idToken);
    await AccountService.deleteAccount({
      authenticatedUser: {
        userId: ctx.user.id,
        firebaseUid: ctx.user.firebaseUid,
      },
      idTokenUID: token.uid,
    });
    await AuthGateway.deleteUser(ctx.user.firebaseUid);
  } catch (error) {
    if (error instanceof AppError) {
      return fail(error);
    } else {
      return fail(GeneralErrors.Unknown());
    }
  }
  return { ok: true, data: null };
}

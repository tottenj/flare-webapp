'use server';
import { AppError } from '@/lib/errors/AppError';
import { AuthErrors } from '@/lib/errors/authError';
import ensure from '@/lib/errors/ensure/ensure';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { FileUploadErrors } from '@/lib/errors/fileUploadErrors';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { ImageMetadata, ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { ActionResult } from '@/lib/types/ActionResult';
import z from 'zod';

export default async function uploadProfilePicture(
  imageData: ImageMetadata
): Promise<ActionResult<null>> {
  const ctx = await UserContextService.requireNone();
  if (!ctx) return fail(AuthErrors.InvalidSession());
  const data = ImageMetadataSchema.safeParse(imageData);
  if (!data.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(data.error));
    return fail(FileUploadErrors.InvalidMetadata(), fieldErrors);
  }
  try {
    ensure(
      data.data.storagePath.startsWith(`users/${ctx.user.firebaseUid}/profile-pic`),
      AuthErrors.Unauthorized()
    );
    await AccountService.updateProfilePicture({ imageData: data.data, userId: ctx.user.id });
    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof AppError) {
      return fail(error);
    } else {
      return fail(GeneralErrors.Unknown());
    }
  }
}

'use server';
import { AppError } from '@/lib/errors/AppError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { FileUploadErrors } from '@/lib/errors/fileUploadErrors';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { ImageMetadata, ImageMetadataSchema } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/ActionResult';
import { updateTag } from 'next/cache';
import z from 'zod';

export default async function uploadProfilePicture(
  imageData: ImageMetadata
): Promise<ActionResult<null>> {
  const ctx = await UserContextService.requireUser();
  const data = ImageMetadataSchema.safeParse(imageData);
  if (!data.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(data.error));
    return fail(FileUploadErrors.InvalidMetadata(), fieldErrors);
  }
  try {
    await AccountService.updateProfilePicture({
      imageData: data.data,
      authenticatedUser: { userId: ctx.user.id, firebaseUid: ctx.user.firebaseUid },
    });
    updateTag(`profile-pic:${data.data.storagePath}`)
    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof AppError) {
      return fail(error);
    } else {
      return fail(GeneralErrors.Unknown());
    }
  }
}

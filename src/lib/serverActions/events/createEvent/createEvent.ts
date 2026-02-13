'use server';
import { AppError } from '@/lib/errors/AppError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { MoneyError } from '@/lib/errors/moneyError/MoneyError';
import { logger } from '@/lib/logger';
import { CreateEvent, CreateEventSchema } from '@/lib/schemas/event/createEventFormSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import ImageService from '@/lib/services/imageService/ImageService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/ActionResult';
import z from 'zod';

export default async function createEvent(input: CreateEvent): Promise<ActionResult<null>> {
  const ctx = await UserContextService.requireOrg();
  const sanitized = CreateEventSchema.safeParse(input);

  if (!sanitized.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
    const possiblePath = input.image?.storagePath;
    if (possiblePath && possiblePath.startsWith(`events/${ctx.user.firebaseUid}`)) {
      await ImageService.deleteByStoragePath(possiblePath).catch((error) => {
        logger.error('STORAGE_ERROR', { error });
      });
    }
    return fail(GeneralErrors.InvalidFileInput(), fieldErrors);
  }
  const { data } = sanitized;

  try {
    await EventService.createEvent(
      { userId: ctx.user.id, firebaseUid: ctx.user.firebaseUid, orgId: ctx.profile.orgProfile?.id },
      data
    );
  } catch (error) {
    if (error instanceof MoneyError) {
      const appErr = new AppError({
        code: error.name,
        clientMessage: error.message,
      });
      return fail(appErr);
    }
    if (error instanceof AppError) {
      return fail(error);
    }
    return fail(GeneralErrors.Unknown());
  }
  return { ok: true, data: null };
}

'use server';
import { AppError } from '@/lib/errors/AppError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { EditEventInputSchema } from '@/lib/schemas/event/editEventInputSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/responses/ActionResult';
import z from 'zod';
import cleanupUploadedImageOnFailure from '@/lib/storage/cleanupUploadedImageOnFailure';

export default async function editEvent(
  eventId: string,
  input: unknown
): Promise<ActionResult<void>> {
  const ctx = await UserContextService.requireOrg();
  const actor = UserContextService.getOrgActor(ctx);
  const sanitized = EditEventInputSchema.safeParse(input);

  if (!sanitized.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
    await cleanupUploadedImageOnFailure(input, ctx.user.firebaseUid);
    return fail(GeneralErrors.InvalidFileInput(), fieldErrors);
  }



  
  try {
    await EventService.editEvent(eventId, actor, sanitized.data);
  } catch (error) {
    await cleanupUploadedImageOnFailure(input, ctx.user.firebaseUid);
    if (error instanceof AppError) {
      return fail(error);
    }
    return fail(GeneralErrors.Unknown());
  }
  return { ok: true, data: undefined };
}

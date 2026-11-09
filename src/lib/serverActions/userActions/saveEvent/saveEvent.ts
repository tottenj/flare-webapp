'use server';

import { AppError } from '@/lib/errors/AppError';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/responses/ActionResult';
import z from 'zod';

export default async function saveEvent(input: {
  eventId: string;
  save: boolean;
}): Promise<ActionResult<void>> {
  const sanitized = z
    .object({
      eventId: z.string(),
      save: z.boolean(),
    })
    .safeParse(input);

  if (!sanitized.success) {
    const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
    return fail(GeneralErrors.InvalidFileInput(), fieldErrors);
  }

  const ctx = await UserContextService.requireUser();
  const actor = UserContextService.getEventActor(ctx);

  try {
    await EventService.saveEvent(sanitized.data.eventId, actor, sanitized.data.save);
  } catch (error) {
    if (error instanceof AppError) {
      return fail(error);
    }
    return fail(GeneralErrors.Unknown());
  }

  return { ok: true, data: undefined };
}

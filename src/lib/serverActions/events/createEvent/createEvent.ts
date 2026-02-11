'use server';
import { extractFieldErrors } from '@/lib/errors/extractError';
import fail from '@/lib/errors/fail';
import { GeneralErrors } from '@/lib/errors/GeneralErrors';
import { CreateEventForm, CreateEventFormSchema } from '@/lib/schemas/event/createEventFormSchema';
import { ActionResult } from '@/lib/types/ActionResult';
import z from 'zod';


export default async function createEvent(input: CreateEventForm): Promise<ActionResult<null>> {
  const sanitized = CreateEventFormSchema.safeParse(input)
  if(!sanitized.success){
     const fieldErrors = extractFieldErrors(z.treeifyError(sanitized.error));
     return fail(GeneralErrors.Unknown(), fieldErrors)
  }
  const {data} = sanitized

  return { ok: true, data: null };
}

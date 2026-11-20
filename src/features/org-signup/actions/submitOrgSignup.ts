'use server';

import { extractFieldErrors } from '@/lib/errors/extractError';
import type { ActionResult } from '@/lib/types/responses/ActionResult';
import { orgCreateSchema, type orgCreateValues } from '../schemas/orgCreateSchema';
import z from 'zod';

export default async function submitOrgSignup(formData: FormData): Promise<ActionResult<null>> {
  const rawLocation = formData.get('location');
  let location: unknown;
  if (typeof rawLocation === 'string') {
    try {
      location = JSON.parse(rawLocation);
    } catch {
      location = rawLocation;
    }
  }

  const values = {
    name: formData.get('name'),
    location,
    description: formData.get('description'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    website: formData.get('website'),
    socialProofType: formData.get('socialProofType'),
    socialProofDetails: formData.get('socialProofDetails'),
    socialProofFile: formData.get('socialProofFile') ?? undefined,
  };
  const parsed = orgCreateSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Please correct the highlighted fields.',
        fieldErrors: extractFieldErrors(z.treeifyError(parsed.error)),
      },
    };
  }

  return { ok: true, data: null };
}

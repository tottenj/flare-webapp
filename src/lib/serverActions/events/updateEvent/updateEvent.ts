'use server';

import { ActionResult } from '@/lib/types/responses/ActionResult';

export default async function updateEvent(): Promise<ActionResult<null>> {
  return {
    ok: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'Update event is not implemented yet.',
    },
  };
}

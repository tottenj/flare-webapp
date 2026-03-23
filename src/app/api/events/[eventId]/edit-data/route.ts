
import { AppError } from '@/lib/errors/AppError';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ActionResult } from '@/lib/types/ActionResult';
import { NextRequest } from 'next/server';

export default async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<ActionResult<EditEventData>> {
  const { eventId } = await params;
  const ctx = await UserContextService.requireOrg()
  const actor = UserContextService.getOrgActor(ctx);



  return fail(
    new AppError({
      code: 'UNKNOWN',
      clientMessage: 'Something went wrong. Please try again.',
    })
  );
}

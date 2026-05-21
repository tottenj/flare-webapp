import handleRouteError from '@/lib/errors/routeError/handleRouteError';
import { EditEventData } from '@/lib/schemas/event/editEventDataSchema';
import { EventService } from '@/lib/services/eventService/eventService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { ApiSuccess } from '@/lib/types/responses/ApiResponse';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  const { eventId } = await params;
  const ctx = await UserContextService.requireOrg();
  const actor = UserContextService.getOrgActor(ctx);

  try {
    const editData = await EventService.getEditData(eventId, actor);
    return NextResponse.json<ApiSuccess<EditEventData>>({
      data: editData,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

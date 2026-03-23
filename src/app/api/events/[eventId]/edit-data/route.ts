import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
): Promise<NextResponse> {
  const { eventId } = await params;
  const ctx = await UserContextService.requireOrg();
  const actor = UserContextService.getOrgActor(ctx);

  return NextResponse.json(
    {
      error: {
        code: 'DLSKjf',
        message: 'Ldfksjf',
      },
    },
    { status: 500 }
  );
}

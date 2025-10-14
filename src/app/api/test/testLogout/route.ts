// /app/api/test/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { deleteCookie } from 'cookies-next';

export async function POST(req: NextRequest) {
  if (process.env.MODE !== 'test') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const res = NextResponse.json({ message: 'Logged out' });
  deleteCookie('__session', { res, path: '/' });

  return res;
}

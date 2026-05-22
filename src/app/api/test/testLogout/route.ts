// /app/api/test/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.MODE !== 'test') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  const res = NextResponse.json({ message: 'Logged out' });
  res.cookies.delete('session');

  return res;
}

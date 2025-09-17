'use server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.MODE !== 'test')
    return NextResponse.json({ error: 'This is not a production route' }, { status: 403 });
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: 'Must include token' }, { status: 403 });

  const isLocal = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MODE === 'test';

  (await cookies()).set({
    name: '__session',
    value: idToken,
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  return NextResponse.json({ status: 200 });
}

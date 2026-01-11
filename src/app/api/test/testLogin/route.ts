'use server';
import AuthGateway from '@/lib/auth/authGateway';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (process.env.MODE !== 'test') return NextResponse.json({ error: 'This is not a production route' }, { status: 403 });
  const { idToken } = await req.json();
  if (!idToken) return NextResponse.json({ error: 'Must include token' }, { status: 403 });
  const isLocal = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_MODE === 'test';

  const sesionCookie = await AuthGateway.createSession(idToken);


  console.log(sesionCookie.sessionCookie);

  (await cookies()).set({
    name: 'session',
    value: sesionCookie.sessionCookie,
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  });

  return NextResponse.json({ status: 200 });
}

import { getFunctionsFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { httpsCallable } from 'firebase/functions';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const functions = await getFunctionsFromServer();
  const signToken = httpsCallable(functions, 'signToken');
  const isLocal = process.env.MODE === 'test';

  const { data }: any = await signToken({ idToken });
  if (!data || !data.sessionCookie || !data.expiresIn) {
    return NextResponse.json('No data returned', { status: 400 });
  }

  const cookiesObj = await cookies();
  cookiesObj.set('__session', data.sessionCookie, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: 'strict',
    maxAge: data.expiresIn / 1000,
    path: '/',
  });

  return NextResponse.json('Cookie set', { status: 200 });
}


export async function DELETE(req: NextRequest){
   (await cookies()).delete('__session');
   return NextResponse.json("Session Deleted", {status: 200});
}
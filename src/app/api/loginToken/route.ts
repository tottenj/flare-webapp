'use server';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { idToken } = await req.json();
  const isLocal = process.env.MODE === 'test';


  try {
    const resp = await fetch(
      `${process.env.FUNCTIONS_URL}/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/us-central1/signToken`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      }
    );

    
    const data  = await resp.json()
  
   
   
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
  } catch (error) {
    console.log(error);
    return NextResponse.json('Error', {status: 400})
    
  }


  
}

export async function DELETE(req: NextRequest) {
  (await cookies()).delete('__session');
  return NextResponse.json('Session Deleted', { status: 200 });
}

'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import flareLocation from '@/lib/types/Location';
import { GeoPoint } from 'firebase/firestore';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  if (process.env.MODE !== 'test')
    return NextResponse.json({ error: 'This is not a production route' }, { status: 403 });
  const { uid, email, name, isOrg } = await req.json();
  const { fire } = await getFirestoreFromServer();
  if (isOrg) {
    const loc: flareLocation = {
      coordinates: new GeoPoint(43.53828, -79.72716),
      id: 'ChIJtxHemjFrK4gRNJu-FWkLhlk',
      name: 'SDF Consulting',
    };
    const org = new FlareOrg(uid, name, email, undefined, undefined, loc, false);
    await org.addOrg(fire);
  }
  const user = new FlareUser(uid, email, name);
  await user.addUser(fire);
  
  return NextResponse.json({ uid, email, name }, { status: 200 });
}

import 'server-only';
import { cookies } from 'next/headers';

export interface verifyResponse {
  uid?: string;
  claims: {
    admin: boolean | null;
    org: boolean | null;
    verified: boolean | null;
    emailVerified: boolean;
  };
  email?: string;
}

export default async function requireAuth(requiredClaims?: (keyof verifyResponse['claims'])[]) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('__session')?.value;
  if (!sessionCookie) {
    throw new Error('Unauthorized');
  }
  const verifyUrl = `${process.env.FUNCTIONS_URL}/${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}/us-central1/verifySessionCookie`;
  const verifyResponse = await fetch(verifyUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.INTERNAL_API_KEY}`,
      Cookie: `__session=${sessionCookie}`,
    },
  });
  if (!verifyResponse.ok) {
    console.error('Verify function failed', await verifyResponse.text());
    throw new Error('Unauthorized');
  }
  const result = (await verifyResponse.json()) as verifyResponse;
  if (!result.uid) throw Error('Missing UID');
  if (!result.email) throw Error('Missing email');

  if (requiredClaims?.length) {
    for (const claim of requiredClaims) {
      if (!result.claims[claim]) {
        throw new Error(`Forbidden: missing required claim ${claim}`);
      }
    }
  }

  return {
    uid: result.uid,
    claims: result.claims,
    email: result.email,
  };
}

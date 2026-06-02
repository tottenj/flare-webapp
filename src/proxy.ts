// middleware.ts
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

async function isSessionCookieValid(sessionCookie: string): Promise<boolean> {
  const functionUrl = process.env.FIREBASE_FUNCTION_URL;
  if (!functionUrl) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${functionUrl}/verifySession`, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionCookie }),
      cache: 'no-store',
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 1. Get the session cookie
  const session = (await cookies()).get('session')?.value;

  // 2. Define protected and public routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = ['/signin', '/signup', '/flare-signin', '/confirmation'].includes(
    request.nextUrl.pathname
  );

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  // 3. Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  // 4. Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    const validSession = await isSessionCookieValid(session);

    if (validSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Clear stale cookies to prevent signin<->dashboard redirect loops.
    const res = NextResponse.next();
    res.cookies.delete('session');
    return res;
  }

  return NextResponse.next();
}

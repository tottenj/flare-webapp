// middleware.ts
import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // 1. Get the session cookie
  const session = (await cookies()).get('session')?.value;

  // 2. Define protected and public routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard');
  const isAuthRoute = ['/signin', '/signup', '/flare-signin', '/confirmation'].includes(request.nextUrl.pathname);

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  // 3. Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/events', request.url));
  }

  // 4. Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  
  return NextResponse.next();
}

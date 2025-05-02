// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // 1. Get the session cookie
  const session = (await cookies()).get("__session")?.value;

  // 2. Define protected and public routes
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/login", "/signup", "/"].includes(request.nextUrl.pathname);

  // 3. Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Redirect authenticated users away from auth routes
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

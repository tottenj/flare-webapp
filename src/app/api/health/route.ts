// app/api/health/route.ts  (Next.js 13+ app router)
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' }, { status: 200 });
}

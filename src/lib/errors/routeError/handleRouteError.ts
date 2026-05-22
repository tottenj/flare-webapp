import { AppError } from '@/lib/errors/AppError';
import { NextResponse } from 'next/server';

export default function handleRouteError(error: unknown) {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          message: error.clientMessage,
          code: error.code, 
        },
      },
      { status: error.status }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}
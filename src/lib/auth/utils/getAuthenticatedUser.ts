import 'server-only';
import { cookies } from 'next/headers';
import AuthGateway from '@/lib/auth/authGateway';
import { AppError } from '@/lib/errors/AppError';
import { logger } from '@/lib/logger';

export type AuthenticatedUser = {
  uid: string;
  email: string;
  emailVerified: boolean;
  role?: string;
};

export default async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;

  try {
    return await AuthGateway.verifySession(session);
  } catch (err) {
    if (err instanceof AppError) {
        console.log(err.code)
      return null;
    }
    logger.error('Failed to verify session', { err });
    return null;
  }
}

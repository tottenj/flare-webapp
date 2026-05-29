import { AuthenticatedUser } from '@/lib/types/AuthenticatedUser';

export function authUserFactory(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    firebaseUid: 'uid3',
    userId: '3',
    ...overrides,
  };
}

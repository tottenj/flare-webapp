import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { FirebaseError } from 'firebase/app';
import { expect } from '@jest/globals';

describe('mapFirebaseAuthError', () => {
  it('explains when an email is already registered with another provider', () => {
    const err = new FirebaseError(
      'auth/account-exists-with-different-credential',
      'account exists with another provider'
    );

    const result = mapFirebaseAuthError(err);

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'ACCOUNT_EXISTS_WITH_DIFFERENT_CREDENTIAL',
        message:
          'An account with this email already exists. Please sign in with the provider you originally used.',
      },
    });
  });

  it('maps invalid credential errors', () => {
    const err = new FirebaseError('auth/invalid-credential', 'bad credentials');

    const result = mapFirebaseAuthError(err);

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password.',
      },
    });
  });

  it('returns action-agnostic fallback for unknown Firebase auth errors', () => {
    const err = new FirebaseError('auth/some-new-code', 'unknown code');

    const result = mapFirebaseAuthError(err);

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'AUTH_FAILED',
        message: 'Authentication failed. Please try again.',
      },
    });
  });

  it('returns unknown error for non-Firebase errors', () => {
    const result = mapFirebaseAuthError(new Error('oops'));

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again.',
      },
    });
  });
});

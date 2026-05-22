import mapFirebaseAuthError from '@/lib/errors/firebaseErrors/mapFirebaseAuthError';
import { FirebaseError } from 'firebase/app';
import {expect} from "@jest/globals"

describe('mapFirebaseAuthError', () => {
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

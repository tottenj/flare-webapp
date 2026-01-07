
import { ActionResult } from '@/lib/types/ActionResult';
import { FirebaseError } from 'firebase/app';

export default function mapFirebaseAuthError(err: unknown): ActionResult<null> {
  if (!(err instanceof FirebaseError)) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong. Please try again.',
      },
    };
  }

  switch (err.code) {
    case 'auth/email-already-in-use':
      return {
        ok: false,
        error: {
          code: 'EMAIL_IN_USE',
          message:
            'An account with this email already exists. Please login. If you forgot your password please click forgot password below.',
        },
      };

    case 'auth/invalid-email':
      return {
        ok: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Please enter a valid email address.',
        },
      };

    case 'auth/weak-password':
      return {
        ok: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 6 characters.',
        },
      };

    case 'auth/network-request-failed':
      return {
        ok: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Network error. Please check your connection.',
        },
      };

    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return {
        ok: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password.',
        },
      };

    case 'auth/user-disabled':
      return {
        ok: false,
        error: {
          code: 'USER_DISABLED',
          message: 'This account has been disabled. Please contact support.',
        },
      };

    case 'auth/too-many-requests':
      return {
        ok: false,
        error: {
          code: 'TOO_MANY_ATTEMPTS',
          message: 'Too many attempts. Please try again later.',
        },
      };

    default:
      return {
        ok: false,
        error: {
          code: 'AUTH_FAILED',
          message: 'Unable to sign up. Please try again.',
        },
      };
  }
}

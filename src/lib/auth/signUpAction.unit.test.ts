import { AuthErrors } from '../errors/authError';
import { logger } from '../logger';
import { AuthService } from '../services/authService/AuthService';
import { signUpAction } from './signUpAction';
import { expect } from '@jest/globals';

jest.mock('../services/authService/AuthService');
jest.mock('../logger');

const mockSignUp = AuthService.signUp as jest.Mock;
const mockLoggerError = logger.error as jest.Mock;

describe('Sign Up Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns ok when signup succeeds', async () => {
    const result = await signUpAction({ idToken: 'valid-token' });
    expect(result).toEqual({ ok: true, data: null });
    expect(mockSignUp).toHaveBeenCalledWith({ idToken: 'valid-token' });
  });

  it('returns field errors for invalid input', async () => {
    const result = await signUpAction({});
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error?.code).toBe('AUTH_INVALID_INPUT');
      expect(result.error.fieldErrors).toBeDefined();
      expect(mockSignUp).not.toHaveBeenCalled();
    }
  });

  it('returns AppError when AuthService throws AppError', async () => {
    const error = AuthErrors.UserAlreadyExists();
    mockSignUp.mockRejectedValueOnce(error);

    const result = await signUpAction({ idToken: 'valid-token' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error?.code).toBe(error.code);
      expect(mockLoggerError).not.toHaveBeenCalled();
    }
  });

  it('logs and returns UNKNOWN error for unexpected error', async () => {
    mockSignUp.mockRejectedValueOnce(new Error('boom'));

    const result = await signUpAction({ idToken: 'valid-token' });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error?.code).toBe('UNKNOWN');
    }
    expect(mockLoggerError).toHaveBeenCalledWith(
      'signUpAction failed',
      expect.objectContaining({
        err: expect.any(Error),
      })
    );
  });
});

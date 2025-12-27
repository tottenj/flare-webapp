import AuthGateway from '@/lib/auth/authGateway';
import { AuthErrors } from '../errors/authError';
import { logger } from '../logger';
import { AuthService } from '../services/authService/AuthService';
import { signUpAction } from './signUpAction';
import { expect } from '@jest/globals';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';

jest.mock('../services/authService/AuthService');
jest.mock('../logger');
jest.mock('@/lib/auth/authGateway', () => ({
  __esModule: true,
  default: {
    deleteUser: jest.fn(),
    verifyIdToken: jest.fn(),
  },
}));

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

  it('cleans up user on cleanup error', async () => {
    (mockSignUp as jest.Mock).mockRejectedValueOnce(new RequiresCleanupError('error', 'fakeUid'));
    (AuthGateway.deleteUser as jest.Mock).mockResolvedValue(undefined);

    const result = await signUpAction({ idToken: 'valid-token' });
    if (result.ok) throw new Error('Should not succeed');
    expect(AuthGateway.deleteUser).toHaveBeenCalledTimes(1);
    expect(AuthGateway.deleteUser).toHaveBeenCalledWith('fakeUid');
    expect(mockLoggerError).toHaveBeenCalled();
    expect(result.error.code).toBe('UNKNOWN');
  });

  it('does NOT cleanup when user already exists', async () => {
    mockSignUp.mockRejectedValueOnce(AuthErrors.UserAlreadyExists());
    await signUpAction({ idToken: 'valid-token' });
    expect(AuthGateway.deleteUser).not.toHaveBeenCalled();
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

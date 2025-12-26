import { cookies } from 'next/headers';
import { AuthService } from '../services/authService/AuthService';
import { expect } from '@jest/globals';
import signInAction from './signInAction';
import { logger } from '../logger';
import { AppError } from '../errors/AppError';
import { AuthErrors } from '../errors/authError';

jest.mock('../services/authService/AuthService', () => ({
  AuthService: {
    signIn: jest.fn(),
  },
}));

describe('signInAction', () => {
  const idToken = 'fakeToken';
  const setMock = jest.fn();
  const signInMock = AuthService.signIn as jest.MockedFunction<typeof AuthService.signIn>;
  beforeEach(() => {
    jest.clearAllMocks();

    (cookies as jest.Mock).mockResolvedValue({
      set: setMock,
    });
  });

  it('Successfully signs in user', async () => {
    signInMock.mockResolvedValueOnce({
      sessionToken: 'sessionToken',
    });
    const result = await signInAction({ idToken });

    expect(signInMock).toHaveBeenCalledWith({ idToken });

    expect(setMock).toHaveBeenCalledWith(
      'session',
      'sessionToken',
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
      })
    );

    expect(result).toEqual({
      ok: true,
      data: null,
    });
  });

  it('Returns correct error on invalid input', async () => {
    const result = await signInAction({ idToken: 4 });
    if (result.ok) throw new Error('Expected failure');
    expect(result.ok).toBe(false);
    expect(setMock).not.toHaveBeenCalled();

    expect(result.error?.code).toBe('AUTH_INVALID_INPUT');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('returns correct app error on failure', async () => {
    signInMock.mockRejectedValueOnce(AuthErrors.EmailUnverified());

    const result = await signInAction({ idToken: 'idToken' });
    if (result.ok) throw new Error('Expected failure');
    expect(logger.error).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('UNVERIFIED_EMAIL');
  });

  it('returns generic error on unknown error', async () => {
    signInMock.mockRejectedValueOnce(new Error('Unkown Error'));
    const result = await signInAction({ idToken: 'idToken' });
    expect(result.ok).toBe(false);

    if (result.ok) throw new Error('Expected failure');
    expect(setMock).not.toHaveBeenCalled();
    expect(result.error.code).toBe('UNKNOWN');
    expect(logger.error).toHaveBeenCalled();
  });
});

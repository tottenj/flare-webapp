import { cookies } from 'next/headers';
import { AuthService } from '../services/authService/AuthService';
import { expect } from '@jest/globals';
import signInAction from './signInAction';
import { logger } from '../logger';
import { AuthErrors } from '../errors/authError';
import { UserLifecycleService } from '@/lib/services/userLifecycleService/userLifecycleService';

jest.mock('../services/authService/AuthService', () => ({
  AuthService: {
    signIn: jest.fn(),
  },
}));

jest.mock('@/lib/services/userLifecycleService/userLifecycleService', () => ({
  __esModule: true,
  UserLifecycleService: {
    onVerifiedSignIn: jest.fn(),
  },
}));

describe('signInAction', () => {
  const idToken = 'fakeToken';
  const setMock = jest.fn();
 
  const signInMock = AuthService.signIn as jest.MockedFunction<typeof AuthService.signIn>;
  const verifiedSignInMock = UserLifecycleService.onVerifiedSignIn as jest.MockedFunction<typeof UserLifecycleService.onVerifiedSignIn>

  beforeEach(() => {
    jest.clearAllMocks();
    (cookies as jest.Mock).mockResolvedValue({
      set: setMock,
    });
  });

  it('Successfully signs in user', async () => {
    signInMock.mockResolvedValueOnce({
      sessionToken: 'sessionToken',
      uid: "uid123"
    });
    const result = await signInAction({ idToken });
    expect(signInMock).toHaveBeenCalledWith({ idToken });
    expect(verifiedSignInMock).toHaveBeenCalledWith('uid123')
    expect(setMock).toHaveBeenCalledWith(
      'session',
      'sessionToken',
      expect.objectContaining({
        httpOnly: true,
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
    expect(verifiedSignInMock).not.toHaveBeenCalled()
    expect(result.error?.code).toBe('AUTH_INVALID_INPUT');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('returns correct app error on failure', async () => {
    signInMock.mockRejectedValueOnce(AuthErrors.EmailUnverified());

    const result = await signInAction({ idToken: 'idToken' });
    if (result.ok) throw new Error('Expected failure');
    expect(logger.error).not.toHaveBeenCalled();
    expect(setMock).not.toHaveBeenCalled();
    expect(verifiedSignInMock).not.toHaveBeenCalled()
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('UNVERIFIED_EMAIL');
  });

  it('returns generic error on unknown error', async () => {
    signInMock.mockRejectedValueOnce(new Error('Unkown Error'));
    const result = await signInAction({ idToken: 'idToken' });
    expect(result.ok).toBe(false);

    if (result.ok) throw new Error('Expected failure');
    expect(setMock).not.toHaveBeenCalled();
    expect(verifiedSignInMock).not.toHaveBeenCalled()
    expect(result.error.code).toBe('UNKNOWN');
    expect(logger.error).toHaveBeenCalled();
  });

});

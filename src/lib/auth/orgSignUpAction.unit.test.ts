import { orgSignUpAction } from '@/lib/auth/orgSignUpAction';
import { AuthService } from '@/lib/services/authService/AuthService';
import { OrgProfileService } from '@/lib/services/orgProfileService.ts/orgProfileService';
import AuthGateway from '@/lib/auth/authGateway';
import { prisma } from '../../../prisma/prismaClient';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
import { AppError } from '@/lib/errors/AppError';
import { expect } from '@jest/globals';
import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';
import { logger } from '@/lib/logger';

jest.mock('@/lib/logger');
jest.mock('../../../prisma/prismaClient', () => ({
  prisma: {
    $transaction: jest.fn(),
  },
}));

const validInput = {
  idToken: 'token',
  org: {
    name: 'Flare Org',
    email: 'org@example.com',
    location: {
      placeId: 'place',
      address: '123 Main St',
      lat: 43,
      lng: -80,
    },
  },
  proofs: [
    {
      platform: 'INSTAGRAM',
      storagePath: 'proof.png',
    },
  ],
};

describe('orgSignUpAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => {
      return cb({});
    });
  });

  it('runs signup inside a transaction and returns ok', async () => {
    jest.spyOn(AuthService, 'signUp').mockResolvedValue(undefined);
    jest.spyOn(OrgProfileService, 'signup').mockResolvedValue(undefined);

    const result = await orgSignUpAction(validInput as any);
    expect(AuthService.signUp).toHaveBeenCalledWith({ idToken: 'token' }, expect.anything());

    expect(OrgProfileService.signup).toHaveBeenCalledWith(
      expect.objectContaining({ org: expect.anything() }),
      expect.anything()
    );
    expect(result).toEqual({ ok: true, data: null });
  });

  it('throws error on invalid input', async () => {
    const invalidInput = { ...validInput, idToken: null } as any;
    const result = await orgSignUpAction(invalidInput);
    if (result.ok) throw new Error('Expected to fail');
    expect(result.ok).toBe(false);
    expect(result.error.code).toBe('AUTH_INVALID_INPUT');
  });

  it('Does cleanup on requires cleanup error', async () => {
    jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(undefined);
    jest
      .spyOn(OrgProfileService, 'signup')
      .mockRejectedValueOnce(new RequiresCleanupError('message', 'uid123'));
    jest.spyOn(AuthGateway, 'deleteUser').mockResolvedValueOnce(undefined);
    const result = await orgSignUpAction(validInput as any);
    if (result.ok) throw new Error('Expected to fail');
    expect(result.ok).toBe(false);
    expect(AuthGateway.deleteUser).toHaveBeenCalledWith('uid123');
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(result.error.code).toBe('UNKNOWN');
  });

  it('logs error on fail of deleteUser', async () => {
    jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(undefined);
    jest
      .spyOn(OrgProfileService, 'signup')
      .mockRejectedValueOnce(new RequiresCleanupError('message', 'uid123'));
    jest.spyOn(AuthGateway, 'deleteUser').mockRejectedValueOnce(new Error());
    const result = await orgSignUpAction(validInput as any);
    if (result.ok) throw new Error('Expected to fail');
    expect(logger.error).toHaveBeenCalledTimes(2);
    expect(result.error.code).toBe('UNKNOWN');
  });

  it('returns AppError directly without wrapping', async () => {
    const appError = new AppError({
      code: 'ORG_ALREADY_EXISTS',
      clientMessage: 'Organization already exists',
    });

    jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(undefined);
    jest.spyOn(OrgProfileService, 'signup').mockRejectedValueOnce(appError);

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected to fail');

    expect(result.error.code).toBe('ORG_ALREADY_EXISTS');
    expect(logger.error).not.toHaveBeenCalled(); // no internal error log
  });

  it('does not call OrgProfileService if AuthService.signUp fails', async () => {
    jest
      .spyOn(AuthService, 'signUp')
      .mockRejectedValueOnce(new AppError({ code: 'AUTH_FAILED', clientMessage: 'Auth failed' }));

    const signupSpy = jest.spyOn(OrgProfileService, 'signup');

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected to fail');

    expect(signupSpy).not.toHaveBeenCalled();
    expect(result.error.code).toBe('AUTH_FAILED');
  });

  it('returns fieldErrors on validation failure', async () => {
    const invalidInput = {
      ...validInput,
      org: { ...validInput.org, name: '' }, // violates schema
    } as any;

    const result = await orgSignUpAction(invalidInput);

    if (result.ok) throw new Error('Expected to fail');
    expect(result.error.code).toBe('AUTH_INVALID_INPUT');
  });

  it('wraps unknown errors as UNKNOWN', async () => {
    jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(undefined);
    jest.spyOn(OrgProfileService, 'signup').mockRejectedValueOnce(new Error('boom'));

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected to fail');

    expect(result.error.code).toBe('UNKNOWN');
    expect(logger.error).toHaveBeenCalled();
  });

  it('does not attempt cleanup for non-cleanup errors', async () => {
    jest.spyOn(AuthService, 'signUp').mockResolvedValueOnce(undefined);
    jest
      .spyOn(OrgProfileService, 'signup')
      .mockRejectedValueOnce(new AppError({ code: 'ORG_INVALID', clientMessage: 'Invalid org' }));

    jest.spyOn(AuthGateway, 'deleteUser');

    await orgSignUpAction(validInput as any);

    expect(AuthGateway.deleteUser).not.toHaveBeenCalled();
  });
});

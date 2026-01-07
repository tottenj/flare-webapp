import { orgSignUpAction } from '@/lib/auth/orgSignUpAction';
import signUpOrgUseCase from '@/lib/useCase/signUpOrgUseCase';
import AuthGateway from '@/lib/auth/authGateway';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
import { AppError } from '@/lib/errors/AppError';
import { expect } from '@jest/globals';
import { logger } from '@/lib/logger';

jest.mock('@/lib/logger');
jest.mock('@/lib/useCase/signUpOrgUseCase');

const mockUseCase = signUpOrgUseCase as jest.Mock;

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
  });

  it('calls use case and returns ok', async () => {
    mockUseCase.mockResolvedValueOnce(undefined);

    const result = await orgSignUpAction(validInput as any);

    expect(mockUseCase).toHaveBeenCalledWith(validInput);
    expect(result).toEqual({ ok: true, data: null });
  });

  it('returns invalid input error on schema failure', async () => {
    const invalidInput = { ...validInput, idToken: null };

    const result = await orgSignUpAction(invalidInput as any);

    if (result.ok) throw new Error('Expected failure');

    expect(result.error.code).toBe('AUTH_INVALID_INPUT');
  });

  it('performs cleanup on RequiresCleanupError', async () => {
    mockUseCase.mockRejectedValueOnce(new RequiresCleanupError('cleanup', 'uid123'));

    jest.spyOn(AuthGateway, 'deleteUser').mockResolvedValueOnce(undefined);

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected failure');

    expect(AuthGateway.deleteUser).toHaveBeenCalledWith('uid123');
    expect(result.error.code).toBe('UNKNOWN');
  });

  it('logs if cleanup fails', async () => {
    mockUseCase.mockRejectedValueOnce(new RequiresCleanupError('cleanup', 'uid123'));

    jest.spyOn(AuthGateway, 'deleteUser').mockRejectedValueOnce(new Error('cleanup failed'));

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected failure');

    expect(logger.error).toHaveBeenCalledTimes(2);
    expect(result.error.code).toBe('UNKNOWN');
  });

  it('returns AppError directly without wrapping', async () => {
    const appError = new AppError({
      code: 'ORG_ALREADY_EXISTS',
      clientMessage: 'Organization already exists',
    });

    mockUseCase.mockRejectedValueOnce(appError);

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected failure');

    expect(result.error.code).toBe('ORG_ALREADY_EXISTS');
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('wraps unknown errors as UNKNOWN', async () => {
    mockUseCase.mockRejectedValueOnce(new Error('boom'));

    const result = await orgSignUpAction(validInput as any);

    if (result.ok) throw new Error('Expected failure');

    expect(result.error.code).toBe('UNKNOWN');
    expect(logger.error).toHaveBeenCalled();
  });

  it('does not attempt cleanup for non-cleanup errors', async () => {
    mockUseCase.mockRejectedValueOnce(
      new AppError({ code: 'ORG_INVALID', clientMessage: 'Invalid org' })
    );

    const deleteSpy = jest.spyOn(AuthGateway, 'deleteUser');

    await orgSignUpAction(validInput as any);

    expect(deleteSpy).not.toHaveBeenCalled();
  });
});

import AuthGateway from '@/lib/auth/authGateway';
import deleteAccount from '@/lib/serverActions/userActions/deleteAccount/deleteAccount';
import { expectFail } from '@/lib/test/expectFail';
import deleteUserUseCase from '@/lib/useCase/deleteUserUseCase';
import { expect, it } from '@jest/globals';

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  UserContextService: {
    requireUser: jest.fn().mockResolvedValue({
      user: {
        id: 'userId',
        firebaseUid: 'firebaseUid',
      },
    }),
  },
}));

jest.mock('@/lib/useCase/deleteUserUseCase', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/lib/auth/authGateway', () => ({
  __esModule: true,
  default: {
    verifyIdToken: jest.fn(),
  },
}));

const mockedAuthGateway = jest.mocked(AuthGateway);
const mockedDeleteUserUseCase = jest.mocked(deleteUserUseCase);

describe('delete Account', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Successfully deletes account', async () => {
    const idToken = 'validIdToken';
    mockedAuthGateway.verifyIdToken.mockResolvedValue({
      uid: 'firebaseUid',
      email: 'email',
      emailVerified: true,
    });
    mockedDeleteUserUseCase.mockResolvedValue(undefined);

    const res = await deleteAccount({ idToken });

    expect(mockedAuthGateway.verifyIdToken).toHaveBeenCalledWith(idToken);
    expect(mockedDeleteUserUseCase).toHaveBeenCalledWith({
      authenticatedUser: {
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      },
      firebaseUid: 'firebaseUid',
    });
    expect(res).toEqual({ ok: true, data: null });
  });

  it('Fails with invalid input', async () => {
    const idToken = '';
    const res = await deleteAccount({ idToken });
    const failed = expectFail(res);
    expect(failed.code).toBe('AUTH_SIGNIN_FAILED');
  });

  it('Fails with unknown error', async () => {
    mockedAuthGateway.verifyIdToken.mockResolvedValue({
      uid: 'firebaseUid',
      email: 'email',
      emailVerified: true,
    });
    mockedDeleteUserUseCase.mockRejectedValue(new Error('Unknown error'));

    const res = await deleteAccount({ idToken: 'validToken' });
    const failed = expectFail(res);
    expect(failed.code).toBe('UNKNOWN');
  });
});

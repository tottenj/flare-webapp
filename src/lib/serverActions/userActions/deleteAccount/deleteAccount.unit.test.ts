import AuthGateway from '@/lib/auth/authGateway';
import deleteAccount from '@/lib/serverActions/userActions/deleteAccount/deleteAccount';
import AccountService from '@/lib/services/accountService/AccountService';
import { expectFail } from '@/lib/test/expectFail';
import { expect } from '@jest/globals';

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

jest.mock('@/lib/services/accountService/AccountService', () => ({
  __esModule: true,
  default: {
    deleteAccount: jest.fn(),
  },
}));

jest.mock('@/lib/auth/authGateway', () => ({
  __esModule: true,
  default: {
    verifyIdToken: jest.fn(),
    deleteUser: jest.fn(),
  },
}));

const mockedAuthGateway = jest.mocked(AuthGateway);
const mockedAccountService = jest.mocked(AccountService);

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
    mockedAccountService.deleteAccount.mockResolvedValue(undefined);
    mockedAuthGateway.deleteUser.mockResolvedValue(undefined);
    const res = await deleteAccount({ idToken });
    expect(mockedAuthGateway.verifyIdToken).toHaveBeenCalledWith(idToken);
    expect(mockedAccountService.deleteAccount).toHaveBeenCalledWith({
      authenticatedUser: {
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      },
      idTokenUID: 'firebaseUid',
    });
    expect(mockedAuthGateway.deleteUser).toHaveBeenCalledWith('firebaseUid');
    expect(res).toEqual({ ok: true, data: null });
  });

  it('Fails with invalid input', async () => {
    const idToken = '';
    const res = await deleteAccount({ idToken });
    const failed = expectFail(res);
    expect(failed.code).toBe('AUTH_SIGNIN_FAILED');
  });

  
});

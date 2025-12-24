import AuthGateway from '@/lib/auth/authGateway';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { AuthService } from './AuthService';
import { expect } from '@jest/globals';
import { AuthErrors } from '@/lib/errors/authError';
import { UniqueConstraintError } from '@/lib/errors/DalErrors';

jest.mock('@/lib/dal/userDal/UserDal', () => ({
  userDal: {
    createIfNotExists: jest.fn(),
  },
}));

describe('AuthService.signUp', () => {
  const mockToken = 'token';

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a user on valid signup', async () => {
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValueOnce({
      uid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });
    (userDal.createIfNotExists as jest.Mock).mockResolvedValueOnce(undefined);
    await expect(AuthService.signUp({ idToken: mockToken })).resolves.not.toThrow();
    expect(AuthGateway.verifyIdToken).toHaveBeenCalledWith(mockToken);
    expect(userDal.createIfNotExists).toHaveBeenCalledWith(
      expect.objectContaining({
        firebaseUid: 'uid123',
        email: 'test@test.com',
        emailVerified: false,
      })
    );
    expect(userDal.createIfNotExists).toHaveBeenCalledTimes(1);
  });

  it('throws if email is empty string', async () => {
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValueOnce({
      uid: 'uid123',
      email: '',
      emailVerified: false,
    });
    await expect(AuthService.signUp({ idToken: mockToken })).rejects.toEqual(
      AuthErrors.EmailRequired()
    );

    expect(userDal.createIfNotExists).not.toHaveBeenCalled();
  });

  it('throws if no email ', async () => {
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValueOnce({
      uid: 'uid123',
      emailVerified: false,
    } as any);
    await expect(AuthService.signUp({ idToken: mockToken })).rejects.toEqual(
      AuthErrors.EmailRequired()
    );
    expect(userDal.createIfNotExists).not.toHaveBeenCalled();
  });

  it('throws unique constraint on duplicate email', async () => {
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValueOnce({
      uid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });
    (userDal.createIfNotExists as jest.Mock).mockRejectedValueOnce(new UniqueConstraintError());
    await expect(AuthService.signUp({ idToken: mockToken })).rejects.toEqual(
      AuthErrors.UserAlreadyExists()
    );
  });

  it('throws on other error', async () => {
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValueOnce({
      uid: 'uid123',
      email: 'test@test.com',
      emailVerified: false,
    });
    (userDal.createIfNotExists as jest.Mock).mockRejectedValueOnce(new Error());
    await expect(AuthService.signUp({ idToken: mockToken })).rejects.toThrow();
  });
});

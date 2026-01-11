import { userDal } from '@/lib/dal/userDal/UserDal';
import { UserLifecycleService } from '@/lib/services/userLifecycleService/userLifecycleService';
import { expect } from '@jest/globals';

jest.mock('@/lib/dal/userDal/UserDal', () => ({
  __esModule: true,
  userDal: {
    findByFirebaseUid: jest.fn(),
    markActive: jest.fn(),
  },
}));

describe('userLifecycleService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully marks user as active', async () => {
    (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ status: 'PENDING' });
    await UserLifecycleService.onVerifiedSignIn('uid123');
    expect(userDal.markActive).toHaveBeenCalledWith('uid123');
  });

  it('throws error if no user', async () => {
    (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce(null);
    await expect(UserLifecycleService.onVerifiedSignIn('uid123')).rejects.toMatchObject({
      code: 'AUTH_SIGNIN_FAILED',
    });
  });
  it('does not call mark active if user is not pending', async () => {
    (userDal.findByFirebaseUid as jest.Mock).mockResolvedValueOnce({ status: 'ACTIVE' });
    await UserLifecycleService.onVerifiedSignIn('uid123');
    expect(userDal.markActive).not.toHaveBeenCalled();
  });
});

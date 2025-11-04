import FlareUserService from '@/lib/prisma/services/FlareUserService/flareUserService';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import isUsersAccount from '@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { expect } from '@jest/globals';
import prisma from '@/lib/prisma/prisma';

jest.mock('@/lib/firebase/auth/utils/requireAuth');
jest.mock('@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount');

describe('Flare User Integration', () => {
  it('creates a flare user end-to-end', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'uid-123' });
    (isUsersAccount as jest.Mock).mockReturnValue(true);
    const userData = {
      email: 'test@example.com',
      account_type: 'org' as 'user' | 'org',
    };
    await FlareUser.create(userData);
    const user = await prisma.user.findUnique({ where: { id: 'uid-123' } });
    expect(user).not.toBeNull();

    const flareUser = await prisma.flareUser.findFirst({
      where: { user_id: 'uid-123' },
    });
    expect(flareUser).not.toBeNull();
  });

  it('throws error if invalid data', async () => {
    await expect(FlareUser.create({ account_type: 'org' } as any)).rejects.toThrow('Invalid Data');
  });

  it('throws if user not authorized', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'uid-123' });
    (isUsersAccount as jest.Mock).mockReturnValue(false);

    const flareUserService = new FlareUserService();
    await expect(flareUserService.createFlareUser('other-id')).rejects.toThrow(
      'Cannot create account'
    );
  });
});

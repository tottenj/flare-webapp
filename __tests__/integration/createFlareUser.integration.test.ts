import FlareUserService from '@/lib/prisma/services/FlareUserService/flareUserService';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import isUsersAccount from '@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { expect } from '@jest/globals';
import prisma from '@/lib/prisma/prisma';
import createFlareUserFromSession from '@/lib/signUp/createFlareUserFromSession';

jest.mock('@/lib/firebase/auth/utils/requireAuth');
jest.mock('@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount');

describe('Flare User Integration', () => {
  it('creates a flare user end-to-end', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'uid-123' });
    (isUsersAccount as jest.Mock).mockReturnValue(true);
    const userData = {
      account_type: 'org' as 'org' | 'user',
      email: 'test@example.com',
    };
    
    const res = await createFlareUserFromSession({email: userData.email, accountType: userData.account_type});
    expect(res.message).toBe('Flare user created successfully');
    expect(res.status).toBe('success');

    const dbUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.account_type).toBe(userData.account_type);
  });

 

  it('throws if user not authorized', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'uid-123' });
    (isUsersAccount as jest.Mock).mockReturnValue(false);

    const flareUserService = new FlareUserService();
    await expect(flareUserService.create('other-id')).rejects.toThrow(
      'Cannot create account'
    );
  });
});

import flareUserDal from '@/lib/prisma/dals/flareUserDal';
import FlareUserService from './flareUserService';
import { expect } from '@jest/globals';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import isUsersAccount from '@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount';

jest.mock('@/lib/firebase/auth/utils/requireAuth');
jest.mock('@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount');
jest.mock('@/lib/prisma/dals/flareUserDal');

describe('Flare User Service', () => {
  let service: FlareUserService;
  let mockCreateFlareUser: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateFlareUser = jest.fn();
    (flareUserDal as unknown as jest.Mock).mockImplementation(() => ({
      createFlareUser: mockCreateFlareUser,
    }));

    service = new FlareUserService();
  });

  it('calls requireAuth when no context is provided', async () => {
    // Arrange
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'mock-uid' });
    (isUsersAccount as jest.Mock).mockReturnValue(true);

    //act
    await service.create('mock-uid');

    //assert
    expect(requireAuth).toHaveBeenCalled();
    expect(isUsersAccount).toHaveBeenCalledWith('mock-uid', 'mock-uid');
    expect(mockCreateFlareUser).toHaveBeenCalledWith(
      expect.objectContaining({
        user: { connect: { id: 'mock-uid' } },
      }),
      undefined
    );
  });

  it('throws when isUsersAccount returns false', async () => {
    (requireAuth as jest.Mock).mockResolvedValue({ uid: 'mock-uid' });
    (isUsersAccount as jest.Mock).mockReturnValue(false);

    await expect(service.create('other-id')).rejects.toThrow('Cannot create account');
  });

  it('uses context.uid if provided (skips requireAuth)', async () => {
    const context = { uid: 'context-uid' };
    (isUsersAccount as jest.Mock).mockReturnValue(true);

    await service.create('context-uid', undefined, context);

    expect(requireAuth).not.toHaveBeenCalled();
    expect(isUsersAccount).toHaveBeenCalledWith('context-uid', 'context-uid');
  });

  it('throws when requireAuth throws (unauthenticated)', async () => {
    // Arrange
    (requireAuth as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    // Act + Assert
    await expect(service.create('some-id')).rejects.toThrow('Unauthorized');

    // 🔍 Ensure we never get to DAL layer
    expect(mockCreateFlareUser).not.toHaveBeenCalled();
    expect(isUsersAccount).not.toHaveBeenCalled();
  });
});

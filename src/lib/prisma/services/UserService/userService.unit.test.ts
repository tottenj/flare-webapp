// __tests__/services/userService.test.ts
import userService from '@/lib/prisma/services/UserService/userService';
import FlareUserService from '@/lib/prisma/services/FlareUserService/flareUserService';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import prisma from '@/lib/prisma/prisma';
import FlareOrgService from '@/lib/prisma/services/FlareOrgService/flareOrgService';
import { expect } from '@jest/globals';

// Mocks
jest.mock('@/lib/firebase/auth/utils/requireAuth');
jest.mock('@/lib/prisma/prisma', () => ({
  $transaction: jest.fn((fn) => fn({})),
}));
jest.mock('@/lib/prisma/dals/userDal/userDal');
jest.mock('@/lib/prisma/services/FlareUserService/flareUserService');
jest.mock('@/lib/prisma/services/FlareOrgService/flareOrgService');

describe('User Service', () => {
  let service: userService;
  const mockTx = {}; // fake transaction context

  describe('createUser', () => {
    beforeEach(() => {
      jest.clearAllMocks();
      service = new userService();
      (service['dal'].createUser as jest.Mock).mockResolvedValue({
        id: 'user-123',
        account_type: 'org',
      });
      (requireAuth as jest.Mock).mockResolvedValue({ uid: 'mock-uid' });
    });

    it('Calls create Flare flareOrgService.create if account type is org', async () => {
      const fakeIncoming = { email: 'test@gmail.com', account_type: 'org' as 'org' };
      const fakeOrg = {
        location: { place_id: 'abc123', coordinates: { lat: 1, lng: 2 }, name: 'placeName' },
      };

      const mockCreate = jest.fn();
      (FlareOrgService as jest.Mock).mockImplementation(() => ({
        create: mockCreate,
      }));

      await service.createUser(fakeIncoming, fakeOrg);
      expect(requireAuth).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(service['dal'].createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-uid',
          email: 'test@gmail.com',
          account_type: 'org',
        }),
        expect.any(Object)
      );
      expect(mockCreate).toHaveBeenCalledWith(fakeOrg, expect.any(Object));
    });

    it('Calls createFlareUser if account type is user', async () => {
       (service['dal'].createUser as jest.Mock).mockResolvedValue({
         id: 'user-123',
         account_type: 'user',
       });
      const fakeIncoming = { email: 'test@gmail.com', account_type: 'user' as 'user' };

      const mockCreate = jest.fn();
      (FlareUserService as jest.Mock).mockImplementation(() => ({
        create: mockCreate,
      }));

      await service.createUser(fakeIncoming);
      expect(requireAuth).toHaveBeenCalled();
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(service['dal'].createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'mock-uid',
          email: 'test@gmail.com',
          account_type: 'user',
        }),
        expect.any(Object)
      );
      expect(mockCreate).toHaveBeenCalledWith("user-123", expect.any(Object), {uid: "mock-uid"});
    });
  });
});

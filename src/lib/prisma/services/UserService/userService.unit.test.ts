// __tests__/services/userService.test.ts
import userService from '@/lib/prisma/services/UserService/userService';
import UserDal from '@/lib/prisma/dals/userDal/userDal';
import FlareUserService from '@/lib/prisma/services/FlareUserService/flareUserService';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import prisma from '@/lib/prisma/prisma';
import FlareOrgService from '@/lib/prisma/services/FlareOrgService/flareOrgService';

// Mocks
jest.mock('@/lib/prisma/prisma', () => ({
  $transaction: jest.fn((fn) => fn({})),
}));
jest.mock('@/lib/prisma/dals/userDal/userDal');
jest.mock('@/lib/prisma/services/FlareUserService/flareUserService');
jest.mock('@/lib/prisma/services/FlareOrgService/flareOrgService');


describe('User Service', () => {


    it("Returns true", () => {
        
    })
});

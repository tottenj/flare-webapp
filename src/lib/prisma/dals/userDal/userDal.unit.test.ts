import prisma from '@/lib/prisma/prisma';
import UserDal from './userDal';
import { expect } from '@jest/globals';
import { Prisma } from '@prisma/client';

describe('userDal', () => {
  let userDal: UserDal;

  beforeEach(() => {
    userDal = new UserDal();
  });

  describe('getOne', () => {
    it('calls prisma.user.findUnique with correct arguments', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      const select = { id: true, email: true };
      const result = await userDal.getOne('1', select);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        select,
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe('createUser', () => {
    it('creates a user', async () => {
      const mockUser = { id: '1', email: 'test@example.com' };
      (prisma.user.create as jest.Mock).mockResolvedValue(mockUser);
      const result = await userDal.createUser({ email: 'test@example.com' });
      expect(prisma.user.create).toHaveBeenCalledWith({ data: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('uses tx if provided', async () => {
      const mockTx = {
        user: {
          create: jest.fn().mockResolvedValue({ id: '1', email: 'test@example.com' }),
        },
      } as unknown as Prisma.TransactionClient;

      const userData = { email: 'test@example.com' };

      const result = await userDal.createUser(userData, mockTx);

      // Ensure the tx's create method was called
      expect(mockTx.user.create).toHaveBeenCalledWith({ data: userData });

      // Ensure result is returned correctly
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });
  });

  describe('delete', () => {
    it('calls prisma.user.delete with correct arguments', async () => {
      (prisma.user.delete as jest.Mock).mockResolvedValue(undefined);

      await userDal.delete('1');

      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
  
});

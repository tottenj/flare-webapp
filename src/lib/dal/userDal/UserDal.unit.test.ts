import { expect } from '@jest/globals';
import { userDal } from './UserDal';
import { prisma } from '../../../../prisma/prismaClient';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UniqueConstraintError } from '@/lib/errors/DalErrors';

jest.mock('../../../../prisma/prismaClient', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe('UserDal.createIfNotExists', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const createdUser = { firebaseUid: 'uid123' };

  it('successfully creates user if one does not exist', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockResolvedValueOnce(createdUser);
    const result = await userDal.createIfNotExists({
      firebaseUid: 'uid123',
    } as any);

    expect(prisma.user.create).toHaveBeenCalled();
    expect(result).toBe(createdUser);
  });

  it('returns existing user if found', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(createdUser);
    const result = await userDal.createIfNotExists({
      firebaseUid: 'uid123',
    } as any);
    expect(result).toBe(createdUser);
    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('throws unique constraint error on duplicate email', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockRejectedValueOnce(
      new PrismaClientKnownRequestError('message', { code: 'P2002', clientVersion: '1.0' })
    );
    await expect(
      userDal.createIfNotExists({ firebaseUid: 'uid123' } as any)
    ).rejects.toBeInstanceOf(UniqueConstraintError);
  });

  it('throws original error if unkown error cause', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null);
    (prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error());
    await expect(
      userDal.createIfNotExists({ firebaseUid: 'uid123' } as any)
    ).rejects.toBeInstanceOf(Error);
  });
});

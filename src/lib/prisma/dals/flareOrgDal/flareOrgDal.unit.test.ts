import prisma from '@/lib/prisma/prisma';
import flareOrgDal from './flareOrgDal';
import { expect } from '@jest/globals';

jest.mock('@/lib/prisma/prisma', () => ({
  flareOrg: {
    create: jest.fn(),
  },
}));

describe('flare org dal create', () => {
  let dal: flareOrgDal;

  beforeEach(() => {
    jest.clearAllMocks();
    dal = new flareOrgDal();
  });

  it('uses prisma when no tx is passed', async () => {
    const fakeData = { description: 'test org' };

    await dal.create(fakeData as any);

    expect(prisma.flareOrg.create).toHaveBeenCalledWith({
      data: {
        verified: false,
        ...fakeData,
      },
    });
  });

  it('uses tx when passed in', async () => {
    const fakeData = { description: 'test org' };

    const mockTx = {
      flareOrg: {
        create: jest.fn(),
      },
    };

    await dal.create(fakeData as any, mockTx as any);

    expect(mockTx.flareOrg.create).toHaveBeenCalledWith({
      data: {
        verified: false,
        ...fakeData,
      },
    });

    // also ensure prisma was NOT used
    expect(prisma.flareOrg.create).not.toHaveBeenCalled();
  });
});

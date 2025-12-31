import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';
import signUpOrgUseCase from '@/lib/useCase/signUpOrgUseCase';
import { expect } from '@jest/globals';
import { resetTestDb } from '../../utils/restTestDb';
import { ProofPlatform } from '@/lib/domain/ProofPlatform';

describe('signUpOrgUseCase (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTestDb();
  });

  const data: OrgSignUpInput = {
    idToken: 'idToken',
    org: {
      name: 'orgName',
      email: 'test@example.com',
      location: {
        placeId: 'place123',
        address: 'address',
        lat: 12,
        lng: 14,
      },
    },
  };

  it('successfully creates user account and org account', async () => {
    await signUpOrgUseCase(data);

    const user = await prisma.user.findUnique({ where: { email: 'test@example.com' } });
    expect(user).not.toBeNull();
    const org = await prisma.organizationProfile.findUnique({
      where: { userId: user!.id },
    });
    expect(org).not.toBeNull();
    const location = await prisma.location.findUnique({ where: { placeId: 'place123' } });
    const socials = await prisma.orgSocial.findMany({ where: { organizationId: org?.id } });
    const proofs = await prisma.orgProofFile.findMany({ where: { organizationId: org?.id } });
    expect(socials).toHaveLength(0);
    expect(proofs).toHaveLength(0);
    expect(location).not.toBeNull();
  });

  it('rolls back user creation on organization fail', async () => {
    const spy = jest.spyOn(orgProfileDal, 'create').mockImplementationOnce(() => {
      throw new Error('org creation failed');
    });
    await expect(signUpOrgUseCase(data)).rejects.toThrow();
    const user = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    expect(user).toBeNull();
    const location = await prisma.location.findUnique({
      where: { placeId: data.org.location.placeId },
    });
    expect(location).toBeNull();
    spy.mockRestore();
  });

  it('prevents duplicate organization signup for same user', async () => {
    const dataWithDupedUser: OrgSignUpInput = {
      ...data,
      org: {
        ...data.org,
        email: 'user@gmail.com',
      },
    };
    await signUpOrgUseCase(dataWithDupedUser);

    await expect(signUpOrgUseCase(data)).rejects.toMatchObject({
      code: 'AUTH_USER_EXISTS',
    });

    const user = await prisma.user.findUnique({
      where: { email: data.org.email },
    });

    const orgs = await prisma.organizationProfile.findMany({
      where: { userId: user!.id },
    });

    expect(orgs).toHaveLength(1);
  });

  it('creates socials and proofs when provided', async () => {
    const enrichedData: OrgSignUpInput = {
      ...data,
      socials: [
        {
          platform: ProofPlatform.INSTAGRAM,
          handle: '@flare',
        },
      ],
      proofs: [
        {
          platform: ProofPlatform.INSTAGRAM,
          storagePath: 'proofs/insta.png',
        },
      ],
    };

    await signUpOrgUseCase(enrichedData);

    const user = await prisma.user.findUnique({
      where: { email: data.org.email },
    });

    const org = await prisma.organizationProfile.findUnique({
      where: { userId: user!.id },
    });

    const socials = await prisma.orgSocial.findMany({
      where: { organizationId: org!.id },
    });
    const proofs = await prisma.orgProofFile.findMany({
      where: { organizationId: org!.id },
    });

    expect(socials).toHaveLength(1);
    expect(proofs).toHaveLength(1);
  });
});

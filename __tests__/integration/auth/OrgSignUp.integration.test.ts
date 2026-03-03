import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import signUpOrgUseCase from '@/lib/useCase/signUpOrgUseCase';
import { expect } from '@jest/globals';
import { ProofPlatform } from '@/lib/domain/ProofPlatform';
import orgSignUpInputFactory from '../../factories/service/orgSignUpInput.factory';
import { createOrgIntegration } from '../../factories/integration/org.factory';
import AuthGateway from '@/lib/auth/authGateway';

describe.skip('signUpOrgUseCase (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully creates user account and org account', async () => {
    const baseData = orgSignUpInputFactory();
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValue({
      uid: `firebase-${baseData.org.email}`,
      email: baseData.org.email,
      emailVerified: true,
    });
    await signUpOrgUseCase(baseData);
    const user = await prisma.user.findUnique({
      where: { email: baseData.org.email },
    });
    expect(user).not.toBeNull();
    const org = await prisma.organizationProfile.findUnique({
      where: { userId: user!.id },
    });
    expect(org).not.toBeNull();
    const location = await prisma.location.findUnique({
      where: { placeId: baseData.org.location.placeId },
    });

    const socials = await prisma.orgSocial.findMany({
      where: { organizationId: org!.id },
    });

    const proofs = await prisma.orgProofFile.findMany({
      where: { organizationId: org!.id },
    });

    expect(socials).toHaveLength(0);
    expect(proofs).toHaveLength(0);
    expect(location).not.toBeNull();
  });

  it('rolls back user creation on organization fail', async () => {
    const baseData = orgSignUpInputFactory();

    const spy = jest.spyOn(orgProfileDal, 'create').mockImplementationOnce(() => {
      throw new Error('org creation failed');
    });

    await expect(signUpOrgUseCase(baseData)).rejects.toThrow();

    const user = await prisma.user.findUnique({
      where: { email: baseData.org.email },
    });
    expect(user).toBeNull();

    const location = await prisma.location.findUnique({
      where: { placeId: baseData.org.location.placeId },
    });
    expect(location).toBeNull();

    spy.mockRestore();
  });

  it('prevents duplicate organization signup for same user', async () => {
    const baseData = orgSignUpInputFactory();
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValue({
      uid: `firebase-${baseData.org.email}`,
      email: baseData.org.email,
      emailVerified: true,
    });
    await createOrgIntegration({
      user: {
        email: baseData.org.email,
        firebaseUid: 'existing-firebase',
      },
    });
    await expect(signUpOrgUseCase(baseData)).rejects.toMatchObject({
      code: 'AUTH_USER_EXISTS',
    });

    const users = await prisma.user.findMany({
      where: { email: baseData.org.email },
    });
    expect(users).toHaveLength(1);
  });

  it('creates socials and proofs when provided', async () => {
    const enrichedData = orgSignUpInputFactory({
      socials: [{ platform: ProofPlatform.INSTAGRAM, handle: '@flare' }],
      proofs: [{ platform: ProofPlatform.INSTAGRAM, storagePath: 'proofs/insta.png' }],
    });
    jest.spyOn(AuthGateway, 'verifyIdToken').mockResolvedValue({
      uid: `firebase-${enrichedData.org.email}`,
      email: enrichedData.org.email,
      emailVerified: true,
    });

    await signUpOrgUseCase(enrichedData);
    const user = await prisma.user.findUnique({
      where: { email: enrichedData.org.email },
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

import AuthGateway from '@/lib/auth/authGateway';
import { locationDal } from '@/lib/dal/locationDal/LocationDal';
import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import { orgProofDal } from '@/lib/dal/orgProofDal/OrgProofDal';
import { orgSocialDal } from '@/lib/dal/orgSocialDal/OrgSocialDal';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { ProofPlatform } from '@/lib/domain/ProofPlatform';
import { AuthErrors } from '@/lib/errors/authError';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
import { UniqueConstraintError } from '@/lib/errors/DalErrors';
import { OrgSignUpInput } from '@/lib/schemas/auth/orgSignUpSchema';
import { OrgProfileService } from '@/lib/services/orgProfileService.ts/orgProfileService';
import { expect } from '@jest/globals';

jest.mock('@/lib/auth/authGateway', () => ({
  __esModule: true,
  default: {
    verifyIdToken: jest.fn(),
  },
}));

jest.mock('@/lib/dal/userDal/UserDal', () => ({
  __esModule: true,
  userDal: {
    findByFirebaseUid: jest.fn(),
  },
}));

jest.mock('@/lib/dal/locationDal/LocationDal', () => ({
  __esModule: true,
  locationDal: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/dal/orgProfileDal/OrgProfileDal', () => ({
  __esModule: true,
  orgProfileDal: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/dal/orgSocialDal/OrgSocialDal', () => ({
  __esModule: true,
  orgSocialDal: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/dal/orgProofDal/OrgProofDal', () => ({
  __esModule: true,
  orgProofDal: {
    create: jest.fn(),
  },
}));

describe('OrgProfileService.signup (unit)', () => {
  const mockVerify = AuthGateway.verifyIdToken as jest.Mock;
  const mockFindUser = userDal.findByFirebaseUid as jest.Mock;
  const mockCreateLocation = locationDal.create as jest.Mock;
  const mockCreateOrg = orgProfileDal.create as jest.Mock;

  const input: OrgSignUpInput = {
    idToken: 'token',
    org: {
      name: 'Flare Org',
      email: 'example@gmail.com',
      location: { placeId: 'placeId', address: '123 St', lat: 1, lng: 2 },
    },
    socials: [{ platform: ProofPlatform.INSTAGRAM, handle: '@flare' }],
    proofs: [{ platform: ProofPlatform.INSTAGRAM, storagePath: 'path' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function mockHappyPath() {
    mockVerify.mockResolvedValue({
      uid: 'uid123',
      email: 'example@gmail.com',
    });
    mockFindUser.mockResolvedValue({ id: 'userId' });
    mockCreateLocation.mockResolvedValue({ id: 'locationId' });
    mockCreateOrg.mockResolvedValue({ id: 'orgId' });
  }

  it('successfully creates org, socials, and proofs', async () => {
    mockHappyPath();

    await OrgProfileService.signup(input);

    expect(mockVerify).toHaveBeenCalledWith('token');
    expect(mockFindUser).toHaveBeenCalledWith('uid123', undefined);
    expect(mockCreateLocation).toHaveBeenCalledWith(input.org.location, undefined);
    expect(mockCreateOrg).toHaveBeenCalledTimes(1);
    expect(orgSocialDal.create).toHaveBeenCalledWith('orgId', input.socials, undefined);
    expect(orgProofDal.create).toHaveBeenCalledWith('orgId', input.proofs, undefined);
  });

  it('throws AUTH_EMAIL_REQUIRED when email is missing', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: null,
    });

    await expect(OrgProfileService.signup(input)).rejects.toMatchObject({
      code: 'AUTH_EMAIL_REQUIRED',
    });
  });

  it('throws RequiresCleanupError when user does not exist', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: 'example@gmail.com',
    });

    mockFindUser.mockResolvedValueOnce(null);

    await expect(OrgProfileService.signup(input)).rejects.toBeInstanceOf(RequiresCleanupError);
  });

  it('maps UniqueConstraintError to AUTH_USER_EXISTS', async () => {
    mockHappyPath();
    mockCreateOrg.mockRejectedValueOnce(new UniqueConstraintError());

    await expect(OrgProfileService.signup(input)).rejects.toMatchObject({
      code: 'AUTH_USER_EXISTS',
    });
  });

  it('wraps unknown errors in RequiresCleanupError', async () => {
    mockHappyPath();
    mockCreateOrg.mockRejectedValueOnce(new Error('unexpected'));

    await expect(OrgProfileService.signup(input)).rejects.toBeInstanceOf(RequiresCleanupError);
  });

  it('does not create socials or proofs when none provided', async () => {
    mockHappyPath();

    await OrgProfileService.signup({
      ...input,
      socials: undefined,
      proofs: undefined,
    });

    expect(orgSocialDal.create).not.toHaveBeenCalled();
    expect(orgProofDal.create).not.toHaveBeenCalled();
  });
});

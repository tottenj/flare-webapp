import AuthGateway from '@/lib/auth/authGateway';
import { locationDal, LocationDal } from '@/lib/dal/locationDal/LocationDal';
import { orgProfileDal } from '@/lib/dal/orgProfileDal/OrgProfileDal';
import { orgProofDal } from '@/lib/dal/orgProofDal/OrgProofDal';
import { orgSocialDal } from '@/lib/dal/orgSocialDal/OrgSocialDal';
import { userDal } from '@/lib/dal/userDal/UserDal';
import { AuthErrors } from '@/lib/errors/authError';
import { RequiresCleanupError } from '@/lib/errors/CleanupError';
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

describe('orgProfileService.signup', () => {
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
    socials: [{ platform: 'INSTAGRAM', handle: '@flare' }],
    proofs: [{ platform: 'INSTAGRAM', storagePath: 'path' }],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully calls all functions', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: 'example@gmail.com',
      emailVerified: false,
    });
    mockFindUser.mockResolvedValueOnce({
      id: 'userId',
      org: {
        name: 'name',
      },
    });
    mockCreateLocation.mockResolvedValueOnce({
      id: 'locationId',
    });
    mockCreateOrg.mockResolvedValueOnce({
      id: 'orgId',
    });

    await OrgProfileService.signup(input);
    expect(AuthGateway.verifyIdToken).toHaveBeenCalledWith('token');
    expect(mockFindUser).toHaveBeenCalledWith('uid123', undefined);
    expect(mockCreateLocation).toHaveBeenCalledWith(input.org.location, undefined);
    expect(orgProfileDal.create).toHaveBeenCalledTimes(1);
    expect(orgSocialDal.create).toHaveBeenCalledWith('orgId', input.socials, undefined);
    expect(orgProofDal.create).toHaveBeenCalledWith('orgId', input.proofs, undefined);
  });

  it('throws when email is missing', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: null,
    });
    await expect(OrgProfileService.signup(input)).rejects.toMatchObject({ code: 'AUTH_EMAIL_REQUIRED' });
  });

  it('throws when no user found', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: 'example@gmail.com',
      emailVerified: false,
    });

    mockFindUser.mockResolvedValueOnce(null);

    await expect(OrgProfileService.signup(input)).rejects.toBeInstanceOf(RequiresCleanupError);
  });

  it('does not create socials or proofs when none provided', async () => {
    mockVerify.mockResolvedValueOnce({
      uid: 'uid123',
      email: 'example@gmail.com',
      emailVerified: false,
    });
    mockFindUser.mockResolvedValueOnce({
      id: 'userId',
      org: {
        name: 'name',
      },
    });
    mockCreateLocation.mockResolvedValueOnce({
      id: 'locationId',
    });
    mockCreateOrg.mockResolvedValueOnce({
      id: 'orgId',
    });

    await OrgProfileService.signup({
      ...input,
      socials: undefined,
      proofs: undefined,
    });

    expect(orgSocialDal.create).not.toHaveBeenCalled();
    expect(orgProofDal.create).not.toHaveBeenCalled();
  });
});

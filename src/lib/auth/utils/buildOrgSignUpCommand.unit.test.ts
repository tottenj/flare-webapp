import firebaseSignUpHelper from '@/lib/auth/firebaseSignUpHelper';
import { buildOrgSignUpCommand } from '@/lib/auth/utils/buildOrgSignUpCommand';
import { LocationInput } from '@/lib/schemas/LocationInputSchema';
import uploadProofFile from '@/lib/storage/uploadProofFile';
import { expect } from '@jest/globals';

jest.mock('@/lib/auth/firebaseSignUpHelper');
jest.mock('@/lib/storage/uploadProofFile');

describe('builldOrgSignUpCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Successfully returns expected output', async () => {
    (firebaseSignUpHelper as jest.Mock).mockResolvedValueOnce({
      idToken: 'idToken',
      uid: 'uid123',
    });

    const uploadedProof = {
      platform: 'INSTAGRAM',
      storagePath: 'path',
      contentType: 'type',
      sizeBytes: 12,
      originalName: 'fileName',
    };

    (uploadProofFile as jest.Mock).mockResolvedValueOnce(uploadedProof);

    const mockLocation: LocationInput = {
      placeId: 'placeId',
      lat: 10,
      lng: 10,
      address: 'address',
    };
    const mockFormData = new FormData();
    mockFormData.append('email', 'example@gmail.com');
    mockFormData.append('password', 'password');
    mockFormData.append('orgName', 'mockName');
    const mockFile = new File(['test'], 'instagram.png', {
      type: 'image/png',
    });
    const validFiles = {
      instagram: mockFile,
    };
    const result = await buildOrgSignUpCommand({
      formData: mockFormData,
      location: mockLocation,
      validFiles,
    });

    expect(firebaseSignUpHelper).toHaveBeenCalledWith('example@gmail.com', 'password');
    expect(uploadProofFile).toHaveBeenCalledWith(
      mockFile,
      'org/proofs/uid123/instagram-fixed-uuid-instagram.png',
      'instagram'
    );

    expect(result).toEqual({
      idToken: 'idToken',
      org: {
        name: 'mockName',
        email: 'example@gmail.com',
        location: mockLocation,
      },
      proofs: [uploadedProof],
      socials: undefined,
    });
  });

  it('throws error on missing inputs', async () => {
    const formData = new FormData();
    await expect(
      buildOrgSignUpCommand({
        formData,
        location: null,
        validFiles: {},
      })
    ).rejects.toThrow('INVALID_INPUT');
  });

  it('includes socials when provided', async () => {
    (firebaseSignUpHelper as jest.Mock).mockResolvedValueOnce({
      idToken: 'idToken',
      uid: 'uid123',
    });

    const formData = new FormData();
    formData.append('email', 'example@gmail.com');
    formData.append('password', 'password');
    formData.append('orgName', 'mockName');
    formData.append('instagram', '@flare');

    const result = await buildOrgSignUpCommand({
      formData,
      location: {
        placeId: 'placeId',
        lat: 10,
        lng: 10,
        address: 'address',
      },
      validFiles: {},
    });

    expect(result.socials).toEqual([
      {
        platform: 'INSTAGRAM',
        handle: '@flare',
      },
    ]);
  });
});

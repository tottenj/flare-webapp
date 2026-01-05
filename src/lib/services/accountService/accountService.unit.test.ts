import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { profilePicDal } from '@/lib/dal/profiePicDal/ProfilePicDal';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import ImageService from '@/lib/services/imageService/ImageService';
import { expect } from '@jest/globals';
import { prisma } from '../../../../prisma/prismaClient';

jest.mock('../../../../prisma/prismaClient', () => {
  return {
    prisma: {
      $transaction: jest.fn(async (fn: any) => {
        return Promise.resolve().then(() => fn({}));
      }),
    },
  };
});

jest.mock('@/lib/dal/imageAssetDal/ImageAssetDal', () => ({
  __esModule: true,
  imageAssetDal: {
    create: jest.fn(),
  },
}));

jest.mock('@/lib/dal/profiePicDal/ProfilePicDal', () => ({
  __esModule: true,
  profilePicDal: {
    upsertForUser: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
  },
}));

describe('AccountService.updateProfilePicture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('creates image asset and upserts profile pic', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic',
    };

    await AccountService.updateProfilePicture({
      imageData,
      userId: 'userId',
      firebaseUid: 'firebaseUid',
    });

    expect(imageAssetDal.create).toHaveBeenCalledWith(imageData, expect.any(Object));
    expect(profilePicDal.upsertForUser).toHaveBeenCalledWith(
      'userId',
      'imageId',
      expect.any(Object)
    );
  });

  it('throws correct error on wrong image path', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid1/profile-pic',
    };

    await expect(
      AccountService.updateProfilePicture({
        imageData,
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      })
    ).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
  });

  it('successfully catches error from transaction', async () => {
    (imageAssetDal.create as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValueOnce(undefined);
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    await expect(
      AccountService.updateProfilePicture({
        imageData,
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      })
    ).rejects.toThrow();

    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(imageData.storagePath);
  });
});

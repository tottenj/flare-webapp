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
    delete: jest.fn()
  },
}));

jest.mock('@/lib/dal/profiePicDal/ProfilePicDal', () => ({
  __esModule: true,
  profilePicDal: {
    upsertForUser: jest.fn(),
    getByUserId: jest.fn()
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
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
  });

  it('creates image asset and upserts profile pic, no previous profile pic', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    (profilePicDal.getByUserId as jest.Mock).mockResolvedValueOnce(null);

    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic',
    };

    await AccountService.updateProfilePicture({
      imageData,
      authenticatedUser: {
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      },
    });
    expect(imageAssetDal.create).toHaveBeenCalledWith(imageData, expect.any(Object));
    expect(profilePicDal.upsertForUser).toHaveBeenCalledWith(
      'userId',
      'imageId',
      expect.any(Object)
    );
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled()
    expect(imageAssetDal.delete).not.toHaveBeenCalled()
  });


  it('creates image asset and upserts profile pic, 1 previous profile pic', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    (imageAssetDal.delete as jest.Mock).mockResolvedValueOnce(undefined);
    (profilePicDal.getByUserId as jest.Mock).mockResolvedValueOnce({
      imageAssetId: 1000,
      imageAsset: { 
        storagePath: 'users/firebaseUid/profile-pic1' 
      },
    });

    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic',
    };

    await AccountService.updateProfilePicture({
      imageData,
      authenticatedUser: {
        userId: 'userId',
        firebaseUid: 'firebaseUid',
      },
    });
    expect(imageAssetDal.create).toHaveBeenCalledWith(imageData, expect.any(Object));
    expect(profilePicDal.upsertForUser).toHaveBeenCalledWith(
      'userId',
      'imageId',
      expect.any(Object)
    );
    expect(imageAssetDal.delete).toHaveBeenCalledWith(1000, expect.any(Object))
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('users/firebaseUid/profile-pic1');
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
        authenticatedUser: {
          userId: 'userId',
          firebaseUid: 'firebaseUid',
        },
      })
    ).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
  });

  it('successfully catches error from transaction', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValueOnce(undefined);
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic',
    };
    (prisma.$transaction as jest.Mock).mockRejectedValueOnce(new Error('Error'));

    await expect(
      AccountService.updateProfilePicture({
        imageData,
        authenticatedUser: {
          userId: 'userId',
          firebaseUid: 'firebaseUid',
        },
      })
    ).rejects.toThrow();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(imageData.storagePath);
  });
});

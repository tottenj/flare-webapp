import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';
import { profilePicDal } from '@/lib/dal/profiePicDal/ProfilePicDal';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import ImageService from '@/lib/services/imageService/ImageService';
import { expect } from '@jest/globals';
import { prisma } from '../../../../prisma/prismaClient';
import { userDal } from '@/lib/dal/userDal/UserDal';

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
    delete: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

jest.mock('@/lib/dal/profiePicDal/ProfilePicDal', () => ({
  __esModule: true,
  profilePicDal: {
    upsertForUser: jest.fn(),
    getByUserId: jest.fn(),
  },
}));

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
    deleteManyByStoragePaths: jest.fn(),
  },
}));

jest.mock('@/lib/dal/userDal/UserDal', () => ({
  __esModule: true,
  userDal: {
    deleteUser: jest.fn(),
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
      storagePath: 'users/firebaseUid/profile-pic/kalsdj',
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
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(imageAssetDal.delete).not.toHaveBeenCalled();
  });

  it('creates image asset and upserts profile pic, 1 previous profile pic', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    (imageAssetDal.delete as jest.Mock).mockResolvedValueOnce(undefined);
    (profilePicDal.getByUserId as jest.Mock).mockResolvedValueOnce({
      imageAssetId: 1000,
      imageAsset: {
        storagePath: 'users/firebaseUid/profile-pic1/cryptoId',
      },
    });

    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic/lskdjfkj',
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
    expect(imageAssetDal.delete).toHaveBeenCalledWith(1000, expect.any(Object));
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(
      'users/firebaseUid/profile-pic1/cryptoId'
    );
  });

  it('throws correct error on wrong image path', async () => {
    (imageAssetDal.create as jest.Mock).mockResolvedValueOnce({
      id: 'imageId',
    });
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid1/profile-pic/lksjdf',
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

    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(imageData.storagePath);
  });

  it('successfully catches error from transaction', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValueOnce(undefined);
    const imageData: ImageMetadata = {
      storagePath: 'users/firebaseUid/profile-pic/sldjf',
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

describe('AccountService.deleteAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);
    (ImageService.deleteManyByStoragePaths as jest.Mock).mockResolvedValue(undefined);
  });

  it("successfully deletes user's account and images", async () => {
    (userDal.deleteUser as jest.Mock).mockResolvedValueOnce([
      { id: 'id1', storagePath: 'users/firebaseUid/profile-pic/cryptoId' },
      { id: 'id2', storagePath: 'users/firebaseUid/proof-images/proof1/cryptoId' },
    ]);
    const authUser = {
      userId: 'userId',
      firebaseUid: 'firebaseUid',
    };
    const idTokenUID = 'firebaseUid';

    await AccountService.deleteAccount({ authenticatedUser: authUser, idTokenUID });
    expect(userDal.deleteUser).toHaveBeenCalledWith('userId');
    expect(imageAssetDal.deleteMany).toHaveBeenCalledWith(['id1', 'id2']);
    expect(ImageService.deleteManyByStoragePaths).toHaveBeenCalledWith([
      'users/firebaseUid/profile-pic/cryptoId',
      'users/firebaseUid/proof-images/proof1/cryptoId',
    ]);
  });

  it("successfully deletes user's account with no images", async () => {
    (userDal.deleteUser as jest.Mock).mockResolvedValueOnce([]);
    const authUser = {
      userId: 'userId',
      firebaseUid: 'firebaseUid',
    };
    const idTokenUID = 'firebaseUid';

    await AccountService.deleteAccount({ authenticatedUser: authUser, idTokenUID });
    expect(userDal.deleteUser).toHaveBeenCalledWith('userId');
    expect(imageAssetDal.deleteMany).not.toHaveBeenCalled();
    expect(ImageService.deleteManyByStoragePaths).not.toHaveBeenCalled();
  });

  it('throws error if idTokenUID does not match authenticatedUser firebaseUid', async () => {
    const authUser = {
      userId: 'userId',
      firebaseUid: 'firebaseUid',
    };
    const idTokenUID = 'differentFirebaseUid';

    await expect(
      AccountService.deleteAccount({ authenticatedUser: authUser, idTokenUID })
    ).rejects.toMatchObject({
      code: 'AUTH_UNAUTHORIZED',
    });
    expect(userDal.deleteUser).not.toHaveBeenCalled();
    expect(imageAssetDal.deleteMany).not.toHaveBeenCalled();
    expect(ImageService.deleteManyByStoragePaths).not.toHaveBeenCalled();
  });
});

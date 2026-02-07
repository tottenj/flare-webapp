import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import { expect } from '@jest/globals';
import { prisma } from '../../../prisma/prismaClient';
import { AuthErrors } from '@/lib/errors/authError';
import { resetTestDb } from '../../utils/restTestDb';
import ImageService from '@/lib/services/imageService/ImageService';
import { imageAssetDal } from '@/lib/dal/imageAssetDal/ImageAssetDal';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  __esModule: true,
  default: {
    deleteByStoragePath: jest.fn(),
  },
}));

describe('AccountService.updateProfilePicture (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTestDb();
  });

  it('successfully uploads image data and links it to profile picture', async () => {
    const imageData: ImageMetadata = {
      storagePath: 'users/uid1/profile-pic/fixed-uuid',
      contentType: 'jpg',
      sizeBytes: 2,
      originalName: 'original name',
    };

    await AccountService.updateProfilePicture({
      imageData,
      authenticatedUser: {
        userId: '1',
        firebaseUid: 'uid1',
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: '1' },
      include: {
        profilePic: {
          include: {
            imageAsset: true,
          },
        },
      },
    });

    expect(user?.profilePic).toBeTruthy();
    expect(user?.profilePic?.imageAsset).toMatchObject({
      storagePath: imageData.storagePath,
      contentType: imageData.contentType,
      sizeBytes: imageData.sizeBytes,
      originalName: imageData.originalName,
    });
  });

  it('throws Unauthorized if storagePath does not match firebaseUid', async () => {
    const imageData: ImageMetadata = {
      storagePath: 'users/evilUid/profile-pic/fixed-uuid',
      contentType: 'jpg',
      sizeBytes: 2,
      originalName: 'evil.jpg',
    };

    await expect(
      AccountService.updateProfilePicture({
        imageData,
        authenticatedUser: { userId: '1', firebaseUid: 'uid1' },
      })
    ).rejects.toEqual(AuthErrors.Unauthorized());
  });

  it('replaces existing profile picture for the user', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);

    // First image
    await AccountService.updateProfilePicture({
      imageData: {
        storagePath: 'users/uid1/profile-pic/fixed-uuid',
        contentType: 'jpg',
        sizeBytes: 1,
        originalName: 'first.jpg',
      },
      authenticatedUser: {
        userId: '1',
        firebaseUid: 'uid1',
      },
    });

    const oldImageId = await prisma.profilePic.findUnique({
      where: { userId: '1' },
      include: {
        imageAsset: true,
      },
    });

    if (!oldImageId) throw new Error('Expected Image Id');

    await AccountService.updateProfilePicture({
      imageData: {
        storagePath: 'users/uid1/profile-pic/fixed-uuid2',
        contentType: 'jpg',
        sizeBytes: 2,
        originalName: 'second.jpg',
      },
      authenticatedUser: {
        userId: '1',
        firebaseUid: 'uid1',
      },
    });

    const pics = await prisma.profilePic.findUnique({
      where: { userId: '1' },
      include: {
        imageAsset: true,
      },
    });

    const deletedOldImage = await prisma.imageAsset.findUnique({
      where: { id: oldImageId.imageAssetId },
    });

    expect(deletedOldImage).toBeNull();
    expect(pics).toBeTruthy();
    if (!pics) throw new Error('Expcted picture');
    expect(pics.imageAsset.storagePath).toBe('users/uid1/profile-pic/fixed-uuid2');
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('users/uid1/profile-pic/fixed-uuid');
  });

  it('does cleanup logic on error', async () => {
    (ImageService.deleteByStoragePath as jest.Mock).mockResolvedValue(undefined);

    jest.spyOn(imageAssetDal, 'create').mockImplementationOnce(() => {
      throw new Error('DB exploded');
    });

    await expect(
      AccountService.updateProfilePicture({
        imageData: {
          storagePath: 'users/uid1/profile-pic/fixed-uuid',
          contentType: 'jpg',
          sizeBytes: 1,
          originalName: 'first.jpg',
        },
        authenticatedUser: {
          userId: '1',
          firebaseUid: 'uid1',
        },
      })
    ).rejects.toThrow('DB exploded');

    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith('users/uid1/profile-pic/fixed-uuid');
  });
});

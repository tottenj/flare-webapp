import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import AccountService from '@/lib/services/accountService/AccountService';
import { expect } from '@jest/globals';
import { prisma } from '../../../prisma/prismaClient';
import { AuthErrors } from '@/lib/errors/authError';
import { resetTestDb } from '../../utils/restTestDb';

describe('AccountService.updateProfilePicture (integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetTestDb();
  });

  it('successfully uploads image data and links it to profile pictrue', async () => {
    const imageData: ImageMetadata = {
      storagePath: 'users/uid123/profile-pic',
      contentType: 'jpg',
      sizeBytes: 2,
      originalName: 'original name',
    };

    await AccountService.updateProfilePicture({
      imageData,
      authenticatedUser: {
        userId: 'user1',
        firebaseUid: 'uid123',
      },
    });

    const user = await prisma.user.findUnique({
      where: { id: 'user1' },
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
      storagePath: 'users/evilUid/profile-pic',
      contentType: 'jpg',
      sizeBytes: 2,
      originalName: 'evil.jpg',
    };

    await expect(
      AccountService.updateProfilePicture({
        imageData,
        authenticatedUser: { userId: 'user1', firebaseUid: 'uid123' },
      })
    ).rejects.toEqual(AuthErrors.Unauthorized());
  });

  it('replaces existing profile picture for the user', async () => {
    // First image
    await AccountService.updateProfilePicture({
      imageData: {
        storagePath: 'users/uid123/profile-pic-1',
        contentType: 'jpg',
        sizeBytes: 1,
        originalName: 'first.jpg',
      },
      authenticatedUser: {
        userId: 'user1',
        firebaseUid: 'uid123',
      },
    });

    // Second image
    await AccountService.updateProfilePicture({
      imageData: {
        storagePath: 'users/uid123/profile-pic-2',
        contentType: 'jpg',
        sizeBytes: 2,
        originalName: 'second.jpg',
      },
      authenticatedUser: {
        userId: 'user1',
        firebaseUid: 'uid123',
      },
    });

    const pics = await prisma.profilePic.findMany({
      where: { userId: 'user1' },
      include: {
        imageAsset: true,
      },
    });

    expect(pics).toHaveLength(1);
    expect(pics[0].imageAsset.storagePath).toBe('users/uid123/profile-pic-2');
  });
});

import { logger } from '@/lib/logger';
import ImageService from '@/lib/services/imageService/ImageService';
import cleanupUploadedImageOnFailure from '@/lib/storage/cleanupUploadedImageOnFailure';
import { expect } from '@jest/globals';

jest.mock('@/lib/services/imageService/ImageService', () => ({
  deleteByStoragePath: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('@/lib/logger', () => ({
  logger: {
    error: jest.fn(),
  },
}));

describe('cleanupUploadedImageOnFailure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the uploaded image when there is a failure', async () => {
    const firebaseUid = 'uid123';
    const storagePath = `events/${firebaseUid}/image.jpg`;
    const input = {
      image: {
        isNew: true,
        metadata: {
          storagePath,
        },
      },
    };

    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(storagePath);
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("doesen't delete the image if the storage path does not match the expected pattern", async () => {
    const firebaseUid = 'uid123';
    const input = {
      image: {
        isNew: true,
        metadata: {
          storagePath: `other/${firebaseUid}/image.jpg`,
        },
      },
    };



    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it("desen't delete image if firebaseUid is different", async () => {
    const firebaseUid = 'uid123';
    const input = {
      image: {
        isNew: true,
        metadata: {
          storagePath: `events/otherUid/image.jpg`,
        },
      },
    };

    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('logs an error if image deletion fails', async () => {
    const firebaseUid = 'uid123';
    const storagePath = `events/${firebaseUid}/image.jpg`;
    const input = {
      image: {
        isNew: true,
        metadata: {
          storagePath,
        },
      },
    };

    const error = new Error('Deletion failed');
    (ImageService.deleteByStoragePath as jest.Mock).mockRejectedValue(error);

    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).toHaveBeenCalledWith(storagePath);
    expect(logger.error).toHaveBeenCalledWith('STORAGE_ERROR', { error });
  });

  it('does nothing if there is no image in the input', async () => {
    const firebaseUid = 'uid123';
    const input = {};

    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('does nothing if the image is not new', async () => {
    const firebaseUid = 'uid123';
    const input = {
      image: {
        isNew: false,
        metadata: {
          storagePath: `events/${firebaseUid}/image.jpg`,
        },
      },
    };

    await expect(cleanupUploadedImageOnFailure(input, firebaseUid)).resolves.toBeUndefined();
    expect(ImageService.deleteByStoragePath).not.toHaveBeenCalled();
    expect(logger.error).not.toHaveBeenCalled();
  });
});

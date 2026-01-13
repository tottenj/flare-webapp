import { AppError } from '@/lib/errors/AppError';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import uploadProfilePicture from '@/lib/serverActions/uploadProfilePicture';
import AccountService from '@/lib/services/accountService/AccountService';
import { UserContextService } from '@/lib/services/userContextService/userContextService';
import { expectFail } from '@/lib/test/expectFail';
import { expect } from '@jest/globals';

jest.mock('@/lib/services/accountService/AccountService', () => ({
  __esModule: true,
  default: {
    updateProfilePicture: jest.fn(),
  },
}));

jest.mock('@/lib/services/userContextService/userContextService', () => ({
  __esModule: true,
  UserContextService: {
    requireUser: jest.fn(),
  },
}));

describe('uploadProfilePicture', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully uploads profile picture', async () => {
    (UserContextService.requireUser as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'userId',
        firebaseUid: 'uid123',
      },
    });
    const metaData: ImageMetadata = {
      storagePath: 'users/uid123/profile-pic',
      contentType: 'json',
      sizeBytes: 22,
      originalName: 'originalName',
    };

    await expect(uploadProfilePicture(metaData)).resolves.toEqual({ ok: true, data: null });
    expect(AccountService.updateProfilePicture).toHaveBeenCalledWith({
      imageData: metaData,
      authenticatedUser: {
        userId: 'userId',
        firebaseUid: 'uid123',
      },
    });
  });

 

  it('throws on incorrect input', async () => {
    (UserContextService.requireUser as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'userId',
        firebaseUid: 'uid123',
      },
    });
    const metaData = {
      contentType: 'json',
      sizeBytes: 22,
      originalName: 'originalName',
    };

    //@ts-expect-error
    const error = expectFail(await uploadProfilePicture(metaData));
    expect(error.code).toBe('FILE_UPLOAD_INVALID_INPUT');
  });

  it('returns app error correctly', async () => {
    (UserContextService.requireUser as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'userId',
        firebaseUid: 'uid123',
      },
    });
    (AccountService.updateProfilePicture as jest.Mock).mockRejectedValueOnce(
      new AppError({ code: 'APP_ERROR', clientMessage: 'Client Message' })
    );
    const metaData = {
      storagePath: 'users/uid123/profile-pic',
      contentType: 'json',
      sizeBytes: 22,
      originalName: 'originalName',
    };

    const error = expectFail(await uploadProfilePicture(metaData));
    expect(error.code).toBe('APP_ERROR');
  });

  it('returns general error correctly', async () => {
    (UserContextService.requireUser as jest.Mock).mockResolvedValueOnce({
      user: {
        id: 'userId',
        firebaseUid: 'uid123',
      },
    });
    (AccountService.updateProfilePicture as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const metaData = {
      storagePath: 'users/uid123/profile-pic',
      contentType: 'json',
      sizeBytes: 22,
      originalName: 'originalName',
    };

    const error = expectFail(await uploadProfilePicture(metaData));
    expect(error.code).toBe('UNKNOWN');
  });
});

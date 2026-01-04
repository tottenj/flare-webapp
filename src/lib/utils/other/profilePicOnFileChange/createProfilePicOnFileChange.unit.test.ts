import { auth } from '@/lib/firebase/auth/configs/clientApp';
import uploadProfilePicture from '@/lib/serverActions/uploadProfilePicture';
import uploadFile from '@/lib/storage/uploadFile';
import { createProfilePicOnFileChange } from '@/lib/utils/other/profilePicOnFileChange/createProfilePicOnFileChange';
import { expect } from '@jest/globals';
import { toast } from 'react-toastify';

jest.mock('@/lib/storage/uploadFile');
jest.mock('@/lib/serverActions/uploadProfilePicture');
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

jest.mock('@/lib/firebase/auth/configs/clientApp', () => ({
  __esModule: true,
  auth: {
    currentUser: null as any,
  },
}));

describe('createProfilePicOnFileChange', () => {
  const router = {
    refresh: jest.fn(),
  } as any;
  const file = new File(['img'], 'avatar.jpg', { type: 'image/jpeg' });

  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(auth, 'currentUser', {
      value: null,
      configurable: true,
    });
  });

  it('successfully creates profile picture', async () => {
    Object.defineProperty(auth, 'currentUser', {
      value: { uid: 'uid123' },
      configurable: true,
    });
    (uploadFile as jest.Mock).mockResolvedValueOnce({
      storagePath: 'path',
    });
    (uploadProfilePicture as jest.Mock).mockResolvedValueOnce({
      ok: true,
      data: null,
    });

    const handler = createProfilePicOnFileChange(router);
    await handler('avatar', file);

    expect(uploadFile).toHaveBeenCalledWith(file, `users/uid123/profile-pic.jpeg`);
    expect(uploadProfilePicture).toHaveBeenCalled();
    expect(toast.error).not.toHaveBeenCalled();
    expect(router.refresh).toHaveBeenCalled();
  });

  it('returns if no file', async () => {
    const handler = createProfilePicOnFileChange(router);
    await handler('avatar', null);

    expect(uploadFile).not.toHaveBeenCalled();
    expect(uploadProfilePicture).not.toHaveBeenCalled();
    expect(router.refresh).not.toHaveBeenCalled();
  });

  it('toasts and returns if no user found', async () => {
    Object.defineProperty(auth, 'currentUser', {
      value: null,
      configurable: true,
    });

    const handler = createProfilePicOnFileChange(router);
    await handler('avatar', file);

    expect(toast.error).toHaveBeenCalledWith('Session expired. Please sign in again.');
    expect(uploadFile).not.toHaveBeenCalled();
    expect(uploadProfilePicture).not.toHaveBeenCalled();
    expect(router.refresh).not.toHaveBeenCalled();
  });

  it('toasts and returns if result has an error', async () => {
    Object.defineProperty(auth, 'currentUser', {
      value: { uid: 'uid123' },
      configurable: true,
    });
    (uploadFile as jest.Mock).mockResolvedValueOnce({
      storagePath: 'path',
    });
    (uploadProfilePicture as jest.Mock).mockResolvedValueOnce({
      ok: false,
      error: {
        code: 'failure',
        message: 'failure message',
      },
    });

    const handler = createProfilePicOnFileChange(router);
    await handler('avatar', file);

    expect(toast.error).toHaveBeenCalledWith('failure message');
    expect(router.refresh).not.toHaveBeenCalled();
  });

  it('toasts and returns on unknown error', async () => {
    Object.defineProperty(auth, 'currentUser', {
      value: { uid: 'uid123' },
      configurable: true,
    });
    (uploadFile as jest.Mock).mockRejectedValueOnce(new Error('Error'));
    const handler = createProfilePicOnFileChange(router);
    await handler('avatar', file);

    expect(router.refresh).not.toHaveBeenCalled();
    expect(uploadProfilePicture).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith('Unknown Error Please Try Again Later');
  });
});

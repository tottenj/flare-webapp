import { StorageErrors } from '@/lib/errors/StorageError';
import ImageService from '@/lib/services/imageService/ImageService';
import { expect, it } from '@jest/globals';


jest.mock('react', () => ({
  cache: (fn: any) => fn,
}));


describe('ImageService.getDownloadUrl', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Successfully returns download url', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        downloadUrl: 'https://example.com/image.jpg',
      }),
    });
    const url = await ImageService.getDownloadUrl('users/uid/profile-pic.jpg');
    expect(url).toBe('https://example.com/image.jpg');
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it('Calls fetch with correct headers and body', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({
        downloadUrl: 'url',
      }),
    });

    await ImageService.getDownloadUrl('storagePath');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('getDownloadUrl'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-internal-api-key': expect.any(String),
        }),
        body: JSON.stringify({ storagePath: 'storagePath' }),
        next: expect.objectContaining({
          tags: [`profile-pic:storagePath`],
        }),
      })
    );
  });

  it('throws on fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('error'));
    await expect(ImageService.getDownloadUrl('path2')).rejects.toMatchObject({
      code: StorageErrors.UnknownError().code,
    });
  });

  it.each([
    ['STORAGE_MISSING_PATH', StorageErrors.MissingPath()],
    ['STORAGE_INVALID_PATH', StorageErrors.InvalidPath()],
    ['UNAUTHORIZED', StorageErrors.Unauthorized()],
    ['OTHER', StorageErrors.UnknownError()],
  ])(`maps %s correctly`, async (code, expectedError) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValue({ code }),
    });
    await expect(ImageService.getDownloadUrl('path')).rejects.toMatchObject({
      code: expectedError.code,
    });
  });

  it('throws on json parsing error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error('bad json')),
    });
    await expect(ImageService.getDownloadUrl('path')).rejects.toMatchObject({
      code: 'STORAGE_UNKNOWN_ERROR',
    });
  });

  it('throws on no download url', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({}),
    });
    await expect(ImageService.getDownloadUrl('path')).rejects.toMatchObject({
      code: 'STORAGE_UNKNOWN_ERROR',
    });
  });

  it('throws Timeout error on abort', async () => {
    jest.useFakeTimers();
    (fetch as jest.Mock).mockImplementationOnce(
      (_url, options) =>
        new Promise((_, reject) => {
          options.signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );
    const promise = ImageService.getDownloadUrl('path');
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    await expect(promise).rejects.toEqual(StorageErrors.Timeout());
    jest.useRealTimers();
  });
});

describe('ImageService.deleteByStoragePath', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully deletes file at path', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce({
        ok: true,
      }),
    });
    await expect(ImageService.deleteByStoragePath('storagePath')).resolves.toBeUndefined();
  });

  it('calls fetch with the correct parameters', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    await ImageService.deleteByStoragePath('path');
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('deleteByStoragePath'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'x-internal-api-key': expect.any(String),
        }),
        body: JSON.stringify({ storagePath: 'path' }),
      })
    );
  });

  it.each([
    ['UNSUPPORTED_MEDIA_TYPE', StorageErrors.UnsupportedMediaType()],
    ['STORAGE_MISSING_PATH', StorageErrors.MissingPath()],
    ['UNAUTHORIZED', StorageErrors.Unauthorized()],
    ['OTHER', StorageErrors.UnknownError()],
  ])(`maps %s correctly`, async (code, output) => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockResolvedValueOnce({
        code,
      }),
    });
    await expect(ImageService.deleteByStoragePath('path')).rejects.toMatchObject({ code: output.code });
  });

  it('throws on fetch error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('error'));
    await expect(ImageService.deleteByStoragePath('path2')).rejects.toMatchObject({
      code: StorageErrors.UnknownError().code,
    });
  });

  it('throws on json parsing error', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: jest.fn().mockRejectedValueOnce(new Error('bad json')),
    });
    await expect(ImageService.deleteByStoragePath('path')).rejects.toMatchObject({
      code: 'STORAGE_UNKNOWN_ERROR',
    });
  });

  it('throws Timeout error on abort', async () => {
    jest.useFakeTimers();
    (fetch as jest.Mock).mockImplementationOnce(
      (_url, options) =>
        new Promise((_, reject) => {
          options.signal.addEventListener('abort', () => {
            reject(new DOMException('Aborted', 'AbortError'));
          });
        })
    );
    const promise = ImageService.deleteByStoragePath('path');
    jest.advanceTimersByTime(5000);
    await Promise.resolve();
    await expect(promise).rejects.toEqual(StorageErrors.Timeout());
    jest.useRealTimers();
  });
});

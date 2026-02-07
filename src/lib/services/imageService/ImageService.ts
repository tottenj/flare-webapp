import 'server-only';
import { StorageErrors } from '@/lib/errors/StorageError';
import { HTTP_METHOD } from '@/lib/types/Method';
import { cache } from 'react';
import { AppError } from '@/lib/errors/AppError';

export default class ImageService {
  static getDownloadUrl = cache(async (storagePath: string) => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let res: Response;

    try {
      res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/getDownloadUrl`, {
        signal: controller.signal,
        method: HTTP_METHOD.POST,
        headers: {
          'Content-Type': 'application/json',
          'x-internal-api-key': process.env.INTERNAL_API_KEY!,
        },
        body: JSON.stringify({ storagePath }),
        cache: 'force-cache',
        next: { tags: [`profile-pic:${storagePath}`] },
      });

      let json: any;
      try {
        json = await res.json();
      } catch {
        throw StorageErrors.UnknownError();
      }

      if (!res.ok) {
        switch (json?.code) {
          case 'STORAGE_MISSING_PATH':
            throw StorageErrors.MissingPath();
          case 'STORAGE_INVALID_PATH':
            throw StorageErrors.InvalidPath();
          case 'UNAUTHORIZED':
            throw StorageErrors.Unauthorized();
          default:
            throw StorageErrors.UnknownError();
        }
      }
      if (!json?.downloadUrl) {
        throw StorageErrors.UnknownError();
      }
      return json.downloadUrl;
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw StorageErrors.Timeout();
      }
      if (err instanceof AppError) {
        throw err;
      }
      throw StorageErrors.UnknownError();
    } finally {
      clearTimeout(timeout);
    }
  });

  static async deleteByStoragePath(storagePath: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let res: Response;

    try {
      res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/deleteByStoragePath`, {
        signal: controller.signal,
        method: HTTP_METHOD.POST,
        headers: {
          'Content-Type': 'application/json',
          'x-internal-api-key': process.env.INTERNAL_API_KEY!,
        },
        body: JSON.stringify({ storagePath }),
      });


      if (res.ok) return;

      let json: any = null;
      try {
        json = await res.json();
      } catch {
        throw StorageErrors.UnknownError();
      }

      switch (json?.code) {
        case 'UNSUPPORTED_MEDIA_TYPE':
          throw StorageErrors.UnsupportedMediaType();
        case 'STORAGE_MISSING_PATH':
          throw StorageErrors.MissingPath();
        case 'UNAUTHORIZED':
          throw StorageErrors.Unauthorized();
        default:
          throw StorageErrors.UnknownError();
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw StorageErrors.Timeout();
      }
      if (err instanceof AppError) {
        throw err;
      }
      throw StorageErrors.UnknownError();
    } finally {
      clearTimeout(timeout);
    }
  }
}

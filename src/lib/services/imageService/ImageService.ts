import { StorageErrors } from '@/lib/errors/StorageError';
import { HTTP_METHOD } from '@/lib/types/Method';

export default class ImageService {
  static async getDownloadUrl(storagePath: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let res: Response;

    try {
      res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/getDownloadUrl`, {
        signal: controller.signal,
        method: HTTP_METHOD.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath }),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw StorageErrors.Timeout();
      }
      throw StorageErrors.UnknownError();
    } finally {
      clearTimeout(timeout);
    }

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
        default:
          throw StorageErrors.UnknownError();
      }
    }
    if (!json?.downloadUrl) {
      throw StorageErrors.UnknownError();
    }
    return json.downloadUrl;
  }

  static async deleteByStoragePath(storagePath: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let res: Response;

    try {
      res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/deleteByStoragePath`, {
        signal: controller.signal,
        method: HTTP_METHOD.POST,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storagePath }),
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw StorageErrors.Timeout();
      }
      throw StorageErrors.UnknownError();
    } finally {
      clearTimeout(timeout);
    }

    let json: any;
    try {
      json = await res.json();
    } catch {
      if (res.ok) return;
      throw StorageErrors.UnknownError();
    }

    if (!res.ok) {
      switch (json?.code) {
        case 'STORAGE_MISSING_PATH':
          throw StorageErrors.MissingPath();
        case 'STORAGE_INVALID_PATH':
          throw StorageErrors.InvalidPath();
        default:
          throw StorageErrors.UnknownError();
      }
    }
  }
}

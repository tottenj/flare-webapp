import { StorageErrors } from '@/lib/errors/StorageError';
import { HTTP_METHOD } from '@/lib/types/Method';

export default class ImageService {
  static async getDownloadUrl(storagePath: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(`${process.env.FIREBASE_FUNCTION_URL}/getDownloadUrl`, {
      signal: controller.signal,
      method: HTTP_METHOD.POST,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ storagePath }),
    });

    const json = await res.json();

    if (!res.ok) {
      const { code } = json;
      if (code === 'STORAGE_MISSING_PATH') throw StorageErrors.MissingPath();
      if (code === 'STORAGE_INVALID_PATH') throw StorageErrors.InvalidPath();
      throw StorageErrors.UnkownError()
    }

    return json.downloadUrl;
  }
}

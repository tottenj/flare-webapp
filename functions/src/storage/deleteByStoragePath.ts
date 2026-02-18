import { onRequest, Request } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';
import { requireMethod } from '../utils/guards/requireMethod';
import { requireInternalApiKey } from '../utils/guards/requireInternalApiKey';
import { INTERNAL_API_KEY } from '../secrets';
import { getInternalApiKey } from '../utils/guards/getInternalApiKey';

const ALLOWED_PREFIXES = ['users/', 'org/proofs/'];

export async function deleteByStoragePathHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  if (!requireMethod(req, res, 'POST')) return;
  if (!requireInternalApiKey(req, res, getInternalApiKey())) return;

  if (!req.is('application/json')) {
    res.status(415).json({ code: 'UNSUPPORTED_MEDIA_TYPE' });
    return;
  }

  const { storagePath } = req.body;
  if (!storagePath) {
    res.status(400).json({ code: 'STORAGE_MISSING_PATH' });
    return;
  }

  if (!ALLOWED_PREFIXES.some((prefix) => storagePath.startsWith(prefix))) {
    res.status(403).json({ code: 'STORAGE_PATH_FORBIDDEN' });
    return;
  }

  try {
    await storage.bucket().file(storagePath).delete({ ignoreNotFound: true });
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ code: 'STORAGE_DELETE_FAILED' });
  }
}

export const deleteByStoragePath = onRequest({secrets: [INTERNAL_API_KEY]}, deleteByStoragePathHandler);

import { onRequest } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';

export const deleteByStoragePath = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  if (!req.is('application/json')) {
    res.status(415).json({ code: 'UNSUPPORTED_MEDIA_TYPE' });
    return;
  }

  const apiKey = req.headers['x-internal-api-key'];
  if (apiKey !== process.env.INTERNAL_API_KEY) {
    res.status(401).json({ code: 'UNAUTHORIZED' });
    return;
  }

  const { storagePath } = req.body;
  if (!storagePath) {
    res.status(400).json({ code: 'STORAGE_MISSING_PATH' });
    return;
  }

  try {
    await storage.bucket().file(storagePath).delete({ignoreNotFound: true});
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(500).json({ code: 'STORAGE_DELETE_FAILED' });
  }
});

import { onRequest } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';
import { requireMethod } from '../utils/guards/requireMethod';
import { requireInternalApiKey } from '../utils/guards/requireInternalApiKey';

export const deleteByStoragePath = onRequest(async (req, res) => {
  if(!requireMethod(req, res, "POST")) return
  if(!requireInternalApiKey(req, res)) return

  if (!req.is('application/json')) {
    res.status(415).json({ code: 'UNSUPPORTED_MEDIA_TYPE' });
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

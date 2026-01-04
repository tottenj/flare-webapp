import { onRequest } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';


export const deleteByStoragePath = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const { storagePath } = req.body;
  if (!storagePath) {
    res.status(400).json({ code: 'STORAGE_MISSING_PATH' });
    return;
  }

  try {
    await storage.bucket().file(storagePath).delete();
    res.status(200).json({ ok: true });
  } catch (err) {
    res.status(400).json({ code: 'STORAGE_INVALID_PATH' });
  }
});

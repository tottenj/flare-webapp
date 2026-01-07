import { onRequest } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { requireMethod } from '../utils/guards/requireMethod';
import { requireInternalApiKey } from '../utils/guards/requireInternalApiKey';

export const getDownloadUrl = onRequest(async (req, res) => {
  if (!requireMethod(req, res, 'POST')) return;
  if (!requireInternalApiKey(req, res)) return;

  const { storagePath } = req.body;
  if (!storagePath) {
    res.status(400).json({ code: 'STORAGE_MISSING_PATH' });
    return;
  }

  try {
    const fileUrl = storage.bucket().file(storagePath);
    const downloadUrl = await getDownloadURL(fileUrl);
    res.status(200).json({ downloadUrl });
  } catch (err) {
    res.status(400).json({ code: 'STORAGE_INVALID_PATH' });
  }
});

import { onRequest } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';
import { getDownloadURL } from 'firebase-admin/storage';

export const getDownloadUrl = onRequest(async (req, res) => {
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
    const fileUrl = storage.bucket().file(storagePath);
    const downloadUrl = await getDownloadURL(fileUrl);
    res.status(200).json({ downloadUrl });
  } catch (err) {
    res.status(400).json({ code: 'STORAGE_INVALID_PATH' });
  }
});

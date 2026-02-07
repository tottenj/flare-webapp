import { onRequest, Request } from 'firebase-functions/v2/https';
import { storage } from '../bootstrap/admin';
import { getDownloadURL } from 'firebase-admin/storage';
import { requireMethod } from '../utils/guards/requireMethod';
import { requireInternalApiKey } from '../utils/guards/requireInternalApiKey';
import { INTERNAL_API_KEY } from '../secrets';

export async function getDownloadUrlHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  if (!requireMethod(req, res, 'POST')) return;
  if (!requireInternalApiKey(req, res, INTERNAL_API_KEY.value())) return;

  const { storagePath } = req.body;
  if (!storagePath) {
    res.status(400).json({ code: 'STORAGE_MISSING_PATH' });
    return;
  }

  try {
    const fileUrl = storage.bucket().file(storagePath);
    const downloadUrl = await getDownloadURL(fileUrl);
    res.status(200).json({ downloadUrl });
    return
  } catch (err) {
    res.status(400).json({ code: 'STORAGE_INVALID_PATH' });
    return 
  }
}

export const getDownloadUrl = onRequest({secrets: [INTERNAL_API_KEY]},getDownloadUrlHandler);

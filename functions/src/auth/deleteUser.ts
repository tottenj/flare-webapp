import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';
import type { Request } from 'firebase-functions/v2/https';
import { requireMethod } from '../utils/guards/requireMethod';
import { requireInternalApiKey } from '../utils/guards/requireInternalApiKey';

export async function deleteUserHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  if (!requireMethod(req, res, 'POST')) return;
  if (!requireInternalApiKey(req, res)) return;

  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'UID_REQUIRED' });
    return;
  }

  try {
    await auth.deleteUser(uid);
    res.status(200).json({ ok: true });
    return
  } catch (err) {
    res.status(500).json({ error: 'DELETE_FAILED' });
    return
  }
}

export const deleteUser = onRequest(deleteUserHandler);

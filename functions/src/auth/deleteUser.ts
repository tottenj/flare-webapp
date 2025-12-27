import { onRequest } from "firebase-functions/v2/https";
import { auth } from "../bootstrap/admin";

export const deleteUser = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { uid } = req.body;
  if (!uid) {
    res.status(400).json({ error: 'UID_REQUIRED' });
    return;
  }

  try {
    await auth.deleteUser(uid);
    res.json({ ok: true });
  } catch (err) {
    console.error('deleteUser failed', err);
    res.status(500).json({ error: 'DELETE_FAILED' });
  }
});

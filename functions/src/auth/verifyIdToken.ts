import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';

export const verifyIdToken = onRequest(async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'ID_TOKEN_REQUIRED' });
      return;
    }

    const decoded = await auth.verifyIdToken(idToken);

    res.json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    });
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
  }
});

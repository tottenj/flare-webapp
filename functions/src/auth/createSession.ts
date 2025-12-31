import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';

export const createSession = onRequest(async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { idToken } = req.body;
  if (!idToken) {
    res.status(400).json({ error: 'ID_TOKEN_REQUIRED' });
    return;
  }

  try {
    const decoded = await auth.verifyIdToken(idToken);
    if (!decoded.email_verified) {
      res.status(403).json({ error: 'Email Unverified' });
      return;
    }
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: 1000 * 60 * 60 * 24 * 5,
    });
    res.json({ sessionCookie });
    return;
  } catch (err) {
    res.status(401).json({ error: 'Invalid Token' });
  }
});

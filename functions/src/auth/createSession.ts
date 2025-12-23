import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';

export const createSession = onRequest(async (req, res) => {
  const { idToken } = req.body;

  await auth.verifyIdToken(idToken);

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: 1000 * 60 * 60 * 24 * 5,
  });

  res.json({ sessionCookie });
});

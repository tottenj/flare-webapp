import { onRequest } from 'firebase-functions/v2/https';
import { admin } from '../bootstrap/admin';

export const verifySession = onRequest(async (req, res) => {
  try {
    const { sessionCookie } = req.body;

    if (!sessionCookie) {
      res.status(401).json({ error: 'Missing session cookie' });
      return;
    }

    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
  

    res.status(200).json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    });
    return;
  } catch (err: any) {
    console.error('verifySession failed', err);
    res.status(401).json({
      error: 'Invalid or expired session',
    });
    return;
  }
});

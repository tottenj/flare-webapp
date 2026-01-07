import { onRequest, Request } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';
import { requireMethod } from '../utils/guards/requireMethod';

export async function verifyIdTokenHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  try {
    if (!requireMethod(req, res, 'POST')) return;

    const { idToken } = req.body;

    if (!idToken) {
      res.status(400).json({ error: 'ID_TOKEN_REQUIRED' });
      return;
    }

    const decoded = await auth.verifyIdToken(idToken);

    res.status(200).json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    });
  } catch {
    res.status(401).json({ error: 'INVALID_TOKEN' });
    return;
  }
}

export const verifyIdToken = onRequest(verifyIdTokenHandler);

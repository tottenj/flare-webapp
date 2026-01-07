import { onRequest, Request } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';
import { requireMethod } from '../utils/guards/requireMethod';

export async function verifySessionHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  if (!requireMethod(req, res, 'POST')) return;

  const { sessionCookie } = req.body;
  if (!sessionCookie) {
    res.status(401).json({ error: 'Missing session cookie' });
    return;
  }

  try {
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    res.status(200).json({
      uid: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified,
    });
    return;
  } catch (err: any) {
    res.status(401).json({
      error: 'Invalid or expired session',
    });
    return;
  }
}

export const verifySession = onRequest(verifySessionHandler);

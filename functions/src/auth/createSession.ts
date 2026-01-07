import { onRequest } from 'firebase-functions/v2/https';
import { auth } from '../bootstrap/admin';
import type { Request  } from 'firebase-functions/v2/https';
import { requireMethod } from '../utils/guards/requireMethod';


export async function createSessionHandler(
  req: Request,
  res: Parameters<Parameters<typeof onRequest>[0]>[1]
) {
  if(!requireMethod(req, res, "POST")) return 

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
    res.status(200).json({ sessionCookie });
    return;
  } catch (err) {
    res.status(401).json({ error: 'Invalid Token' });
  }
};


export const createSession = onRequest(createSessionHandler);
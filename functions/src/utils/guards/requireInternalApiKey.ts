import type { Request } from 'firebase-functions/v2/https';

export function requireInternalApiKey(
  req: Request,
  res: { status: Function; json: Function },
  expectedKey: string
): boolean {
  const apiKey = req.headers['x-internal-api-key'];

  if (apiKey !== expectedKey) {
    res.status(401).json({ code: 'UNAUTHORIZED' });
    return false;
  }

  return true;
}

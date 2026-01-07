import type { Request } from 'firebase-functions/v2/https';

export function requireMethod(
  req: Request,
  res: { status: Function; send: Function },
  method: "POST" | "GET" | "PUT"
): boolean {
  if (req.method !== method) {
    res.status(405).send('Method Not Allowed');
    return false;
  }
  return true;
}

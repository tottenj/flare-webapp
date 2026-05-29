import { z } from 'zod';

export function isSafeReturnToPath(path: string): boolean {
  if (!path || !path.startsWith('/')) return false;
  if (path.startsWith('//')) return false;
  if (path.includes('\\')) return false;
  if (/[\u0000-\u001F\u007F]/.test(path)) return false;
  return true;
}

export function coerceSafeReturnToPath(returnTo: string | undefined, fallback: string): string {
  const safeFallback = isSafeReturnToPath(fallback) ? fallback : '/';
  if (!returnTo) return safeFallback;

  const trimmed = returnTo.trim();
  return isSafeReturnToPath(trimmed) ? trimmed : safeFallback;
}

export const ReturnToSchema = z
  .string()
  .trim()
  .refine(isSafeReturnToPath, {
    message: 'returnTo must be a safe internal path',
  })
  .optional();

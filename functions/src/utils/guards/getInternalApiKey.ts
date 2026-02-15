import { INTERNAL_API_KEY } from '../../secrets';

export function getInternalApiKey(): string {
  const key = process.env.INTERNAL_API_KEY_DEV ?? INTERNAL_API_KEY.value();
  if (!key) {
    throw new Error('INTERNAL_API_KEY missing');
  }
  return key;
}
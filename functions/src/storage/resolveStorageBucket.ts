import { storage } from '../bootstrap/admin';

export function resolveStorageBucket() {
  const configuredBucket =
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET;

  return configuredBucket ? storage.bucket(configuredBucket) : storage.bucket();
}

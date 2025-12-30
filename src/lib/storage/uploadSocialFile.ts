'use client';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { FileKey } from '@/lib/hooks/useFileChange/useFileChange';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';

import { resolveProofPlatform } from '@/lib/utils/socialConfig';
import { ref, uploadBytes } from 'firebase/storage';

export default async function uploadSocialFile(
  file: File,
  uid: string,
  key: FileKey
): Promise<ImageMetadata> {
  const path = `org/proofs/${uid}/${key}-${crypto.randomUUID()}-${file.name}`;
  await uploadBytes(ref(storage, path), file);

  return {
    platform: resolveProofPlatform(key),
    storagePath: path,
    contentType: file.type,
    sizeBytes: file.size,
    originalName: file.name,
  };
}

'use client';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { FileKey } from '@/lib/hooks/useFileChange/useFileChange';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';

import { resolveProofPlatform } from '@/lib/utils/socialConfig';
import { ref, uploadBytes } from 'firebase/storage';

export default async function uploadFile(
  file: File,
  path: string,
  key?: FileKey,
 
): Promise<ImageMetadata> {

  await uploadBytes(ref(storage, path), file);

  return {
    platform: key ? resolveProofPlatform(key) : undefined,
    storagePath: path,
    contentType: file.type,
    sizeBytes: file.size,
    originalName: file.name,
  };
}

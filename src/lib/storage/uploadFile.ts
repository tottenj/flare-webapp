'use client';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { ref, uploadBytes } from 'firebase/storage';

export default async function uploadFile(file: File, path: string): Promise<ImageMetadata> {
  const res = await uploadBytes(ref(storage, path), file);
  console.log(res)

  return {
    storagePath: path,
    contentType: file.type,
    sizeBytes: file.size,
    originalName: file.name,
  };
}

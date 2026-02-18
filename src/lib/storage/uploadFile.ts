'use client';
import { storage } from '@/lib/firebase/auth/configs/clientApp';
import { ImageMetadata } from '@/lib/schemas/proof/ImageMetadata';
import { ref, uploadBytes } from 'firebase/storage';

export default async function uploadFile(file: File, path: string): Promise<ImageMetadata> {
  const res = await uploadBytes(ref(storage, path), file);
  const {metadata} = res
  
  return {
    storagePath: metadata.fullPath,
    contentType: metadata.contentType,
    sizeBytes: metadata.size,
    originalName: file.name,
  };
}

import { SocialPlatform } from '@/lib/utils/socialConfig';
import { useState } from 'react';


export type FileKey = SocialPlatform | 'other';

export default function useFileChange() {
  const [files, setFiles] = useState<Record<FileKey, File | null>>({
    instagram: null,
    facebook: null,
    twitter: null,
    other: null,
  });

  function handleFileChange(key: FileKey, file: File) {
    setFiles((prev) => ({ ...prev, [key]: file }));
  }

  function removeFile(key: FileKey) {
    setFiles((prev) => ({ ...prev, [key]: null }));
  }

  function clearFiles() {
    setFiles({
      instagram: null,
      facebook: null,
      twitter: null,
      other: null,
    });
  }

  return {
    validFiles: files,
    handleFileChange,
    removeFile,
    clearFiles,
    hasFile: (key: FileKey) => Boolean(files[key]),
  };
}

'use client';
import { useState } from 'react';
import { toast } from 'react-toastify';
export type FileMap<K extends string> = Record<K, File | null>;

interface UseFileMapOptions<K extends string> {
  initial: FileMap<K>;
  onFileChange?: (key: K, file: File | null) => void | Promise<void>;
}

export default function useFileMap<K extends string>({
  initial,
  onFileChange,
}: UseFileMapOptions<K>) {
  const [files, setFiles] = useState<FileMap<K>>(initial);
  const [isBusy, setIsBusy] = useState(false);
  async function setFile(key: K, file: File | null) {
    if (!onFileChange) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      return;
    }
    setIsBusy(true);
    try {
      toast.info("Uploading File")
      await onFileChange(key, file);
      setFiles((prev) => ({ ...prev, [key]: file }));
      toast.success("Successfully Uploaded File")
    } finally {
      setIsBusy(false);
    }
  }

  function clear() {
    setFiles(initial);
  }

  return {
    files,
    setFile,
    clear,
    remove: (key: K) => setFile(key, null),
    hasFile: (key: K) => Boolean(files[key]),
    isBusy
  };
}

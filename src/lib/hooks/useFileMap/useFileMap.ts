'use client';
import { ClientError } from '@/lib/errors/clientErrors/ClientError';
import { logger } from '@/lib/logger';
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
    if (!file) {
      setFiles((prev) => ({ ...prev, [key]: null }));
      return;
    }

    if (!onFileChange) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      return;
    }
    setIsBusy(true);
    try {
      toast.info('Uploading File');
      await onFileChange(key, file);
      setFiles((prev) => ({ ...prev, [key]: file }));
      toast.success('Successfully Uploaded File');
    } catch (error) {
      if (error instanceof ClientError) {
        logger.error(error.message, error.code)
        toast.error(error.message);
      } else {
        toast.error('Sorry Something Went Wrong Please Try Again Later');
      }
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
    hasFile: (key: K) => Boolean(files[key]),
    isBusy,
  };
}

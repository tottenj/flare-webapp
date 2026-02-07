'use client';

import FileInput from '@/components/inputs/file/FileInput';
import ImageCropper from '@/components/inputs/image/ImageCropper/ImageCropper';
import MainModal from '@/components/modals/MainModal/MainModal';
import { useState } from 'react';

interface ImageCropperInputProps {
  label: string;
  aspect?: number;
  onCropped: (file: File, previewUrl: string) => void;
}
export default function ImageCropperInput({
  label,
  aspect = 1,
  onCropped,
}: ImageCropperInputProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [tempUrl, setTempUrl] = useState<string | null>(null);

  function handleFileSelect(file: File) {
    if (tempUrl) URL.revokeObjectURL(tempUrl);
    const url = URL.createObjectURL(file);
    setTempUrl(url);
    setModalOpen(true);
  }

  function handleClose() {
    if (tempUrl) URL.revokeObjectURL(tempUrl);
    setModalOpen(false);
    setTempUrl(null);
  }

  async function handleCropComplete(croppedFile: File) {
    const previewUrl = URL.createObjectURL(croppedFile);
    onCropped(croppedFile, previewUrl);
    handleClose()
  }

  return (
    <>
      <FileInput buttonText={label} fileAdded={false} name="image" onChange={handleFileSelect} />

      <MainModal isOpen={modalOpen} onClose={handleClose}>
        {tempUrl && (
          <ImageCropper image={tempUrl} aspect={aspect} onComplete={handleCropComplete} />
        )}
      </MainModal>
    </>
  );
}

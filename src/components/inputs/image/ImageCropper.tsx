'use client';
import React, { SetStateAction, useEffect, useState } from 'react';
import Cropper from 'react-easy-crop';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import Modal from '@/components/modals/mainModal/MainModal';
import useImageCrop from '@/lib/hooks/useImageCrop';
import { getCroppedImg } from '@/lib/utils/cropping/getCroppedImage';

type ImageCropperProps = {
  imageUrl: string;
  originalFileName?: string;
  aspect?: number;
  outputWidth?: number;
  setImg: React.Dispatch<SetStateAction<File | null>>;
  imgURL?: string;
  setImgURL: React.Dispatch<SetStateAction<string | null>>;
};

export default function ImageCropper({
  imageUrl,
  originalFileName,
  aspect = 3 / 4,
  outputWidth = 300,
  setImg,
  setImgURL,
}: ImageCropperProps) {
  const {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    setCroppedAreaPixels,
    croppedAreaPixels,
  } = useImageCrop(aspect);
  const [isOpen, setIsOpen] = useState(false);
  const [curImage, setCurImage] = useState('');

  useEffect(() => {
    if (imageUrl && imageUrl != curImage) {
      setIsOpen(true);
    }
  }, [imageUrl]);

  async function handleSave() {
    if (!croppedAreaPixels) return;
    try {
      const croppedFile = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        rotation,
        originalFileName,
        outputWidth
      );
      handleCropComplete(croppedFile);
      setIsOpen(false);
    } catch (err) {
      console.error('Crop failed:', err);
    }
  }

  function handleCropComplete(croppedFile: File) {
    setImg(croppedFile);
    const imgUrl = URL.createObjectURL(croppedFile);
    setCurImage(imgUrl);
    setImgURL(imgUrl);
    return () => URL.revokeObjectURL(imgUrl);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className="relative min-h-[500px]">
        <Cropper
          image={imageUrl}
          aspect={aspect}
          crop={crop}
          onCropChange={setCrop}
          zoom={zoom}
          onZoomChange={setZoom}
          rotation={rotation}
          onRotationChange={setRotation}
          onCropComplete={(_, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels)}
        />
      </div>
        <PrimaryButton datacy="imageCropperButton" text="Save" type="button" click={handleSave} />
    </Modal>
  );
}

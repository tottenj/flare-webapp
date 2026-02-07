'use client';

import Cropper from 'react-easy-crop';
import { useState } from 'react';
import PrimaryButton from '@/components/buttons/primaryButton/PrimaryButton';
import { getCroppedImg } from '@/lib/utils/cropping/getCroppedImage';

export default function ImageCropper({
  image,
  aspect,
  onComplete,
}: {
  image: string;
  aspect: number;
  onComplete: (file: File) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);

  async function confirmCrop() {
    if (!croppedPixels) return;
    const croppedFile = await getCroppedImg(image, croppedPixels);
    onComplete(croppedFile);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative h-[400px] w-full">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setCroppedPixels(pixels)}
        />
      </div>

      <PrimaryButton click={confirmCrop} text='Confirm Crop'/>
    </div>
  );
}

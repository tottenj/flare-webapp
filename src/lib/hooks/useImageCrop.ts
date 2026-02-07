'use client';
// lib/hooks/useImageCrop.ts
import { useState } from 'react';

export default function useImageCrop() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<null | {
    x: number;
    y: number;
    width: number;
    height: number;
  }>(null);

  return {
    crop,
    setCrop,
    zoom,
    setZoom,
    rotation,
    setRotation,
    croppedAreaPixels,
    setCroppedAreaPixels,
  };
}

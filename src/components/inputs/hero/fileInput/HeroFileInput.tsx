'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { InputProps } from '@heroui/react';
import HeroInput, { HeroInputProps } from '../input/HeroInput';

interface HeroFileInputProps extends HeroInputProps {
  setImg: Dispatch<SetStateAction<File | null>>;
}

export default function HeroFileInput({ setImg, ...props }: HeroFileInputProps) {
  const [preview, setPreview] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setImg(file);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreview(null);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <HeroInput
        type="file"
        {...props}
        onChange={handleChange}
        color={preview ? 'success' : 'default'}
      />
    </div>
  );
}

'use client';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import HeroInput, { HeroInputProps } from '../input/HeroInput';

interface HeroFileInputProps extends HeroInputProps {
  setImg: Dispatch<SetStateAction<File | null>>;
  setImgUrl?: Dispatch<SetStateAction<string | null>>;
}

export default function HeroFileInput({ setImg, setImgUrl, ...props }: HeroFileInputProps) {
  const [success, setSuccess] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setImg(file);
      if (setImgUrl) {
        setImgUrl(objectUrl);
      }
      setSuccess(true)
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      if (setImgUrl) {
        setImgUrl(null);
      }
      setSuccess(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <HeroInput
        data-cy="img-input"
        type="file"
        {...props}
        onChange={handleChange}
        color={success ? 'success' : 'default'}
      />
    </div>
  );
}

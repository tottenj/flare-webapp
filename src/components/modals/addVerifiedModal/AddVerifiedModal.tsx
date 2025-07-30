'use client';
import { useState } from 'react';
import Modal from '../mainModal/MainModal';
import Image from 'next/image';

interface addVerifiedModalProps {
  orgName: string;
  children: React.ReactNode;
  profPic: string;
}
export default function AddVerifiedModal({ orgName, children, profPic }: addVerifiedModalProps) {
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(profPic);

  return (
    <div className='flex w-full flex-col flex-wrap'>
      <button
        onClick={() => setOpen(true)}
        type="button"
        className="bg-primary cursor-pointer rounded-full text-white flex w-full flex-wrap gap-2 items-center"
        aria-label="Filter options"
      >
        <div className="relative flex h-[75px] w-[75px] items-center justify-center">
          <Image
            src={failed}
            fill
            alt="profPic"
            className="object-cover"
            onError={() => setFailed('/defaultProfile.svg')}
          />
        </div>
        <b>{orgName}</b>
      </button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {children}
      </Modal>
    </div>
  );
}

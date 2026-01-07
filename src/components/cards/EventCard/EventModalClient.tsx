'use client';
import {  useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import Modal from '@/components/modals/mainModal/MainModal';

type Props = {
  returnTo?: string;
  back?: boolean;
  children: React.ReactNode;
};

export default function EventModalClient({ returnTo, back, children }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isOpen = searchParams.get('modal') === 'true';

  const ret = returnTo || '/events';
  const handleClose = () => {
    if (back) router.back();
    else router.push(ret);
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative h-full">{children}</div>
    </Modal>
  );
}

'use client';

import MainModal from '@/components/modals/MainModal/MainModal';
import { ModalProps } from '@heroui/modal';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useCallback, useEffect, useState } from 'react';

type ForwardedModalProps = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>;
interface RouteModalProps {
  returnTo?: string;
  returnToFallback: string;
  children: ReactNode;
  modalProps?: ForwardedModalProps;
}

export default function ModalRouter({
  returnTo,
  returnToFallback,
  children,
  modalProps,
}: RouteModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    setIsOpen(true);
  }, [pathname]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    router.replace(returnTo ?? returnToFallback);
  }, [returnTo, returnToFallback, router]);

  return (
    <MainModal isOpen={isOpen} onClose={handleClose} modalProps={modalProps}>
      {children}
    </MainModal>
  );
}

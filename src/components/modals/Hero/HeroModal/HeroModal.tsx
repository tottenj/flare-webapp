'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  type ModalProps,
} from '@heroui/react';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface HeroModalProps extends ModalProps {
  trigger?: ReactNode;
  header?: string;
  children: ReactNode;
  footer?: ReactNode;
  returnTo?: string;
}

export default function HeroModal({
  trigger,
  header,
  children,
  footer,
  returnTo,
  radius = 'sm',
  size = '3xl',
  ...modalProps
}: HeroModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const path = usePathname();

  const isEvent = path.includes("event") && !path.includes("events")

  const handleOpenChange = (open: boolean) => {
    if (!open && !trigger && returnTo) {
      router.push(returnTo);
    }
    if (modalProps.onOpenChange) {
      modalProps.onOpenChange(open);
    } else {
      onOpenChange()
    }
  };

  return (
    <>
      {trigger && <div onClick={onOpen}>{trigger}</div>}
      <Modal
        isOpen={trigger ? isOpen : isEvent}
        onOpenChange={handleOpenChange}
        radius={radius}
        size={size}
        className='p-2'
        {...modalProps}
      >
        <ModalContent>
          {(onClose) => (
            <>
              {header && <ModalHeader className="flex flex-col gap-1 text-center text-3xl font-nunito font-bold">{header}</ModalHeader>}
              <ModalBody>{children}</ModalBody>
              {footer && <ModalFooter>{footer}</ModalFooter>}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

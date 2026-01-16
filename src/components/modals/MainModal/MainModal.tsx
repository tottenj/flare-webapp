'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalProps
} from '@heroui/react';
import { ReactNode, cloneElement, isValidElement } from 'react';

type ModalRenderFn = (onClose?: () => void) => ReactNode;
type ForwardedModalProps = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>;

interface MainModalProps {
  trigger: ReactNode;
  header?: ReactNode;
  children: ReactNode | ModalRenderFn;
  footer?: ReactNode | ModalRenderFn;
  modalProps?: ForwardedModalProps;
  defaultOpen?: boolean 
}

export default function MainModal({
  trigger,
  header,
  children,
  footer,
  modalProps,
  defaultOpen = false,
}: MainModalProps) {
  const { isOpen, onOpen, onClose } = useDisclosure({defaultOpen});

  const Trigger = isValidElement(trigger)
    ? cloneElement(trigger as any, { onClick: onOpen })
    : trigger;

  return (
    <>
      {Trigger}

      <Modal {...modalProps} isOpen={isOpen} onClose={onClose} className="rounded-lg">
        <ModalContent>
          {(onClose) => {
            const render = (node: ReactNode | ModalRenderFn) =>
              typeof node === 'function' ? node(onClose) : node;

            return (
              <>
                {header && <ModalHeader>{header}</ModalHeader>}

                <ModalBody>{render(children)}</ModalBody>

                {footer && <ModalFooter>{render(footer)}</ModalFooter>}
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}

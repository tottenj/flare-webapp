'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalProps,
} from '@heroui/react';
import { ReactNode, cloneElement, isValidElement } from 'react';

type ModalRenderFn = (onClose?: () => void) => ReactNode;
type ForwardedModalProps = Omit<ModalProps, 'isOpen' | 'onClose' | 'children'>;

interface MainModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  trigger?: ReactNode;
  header?: ReactNode;
  children: ReactNode | ModalRenderFn;
  footer?: ReactNode | ModalRenderFn;
  modalProps?: ForwardedModalProps;
  defaultOpen?: boolean;
}

export default function MainModal({
  trigger,
  header,
  children,
  footer,
  modalProps,
  defaultOpen = false,
  isOpen: controlledOpen,
  onClose: controlledClose,
}: MainModalProps) {
  const disclosure = useDisclosure({ defaultOpen });

  const isControlled = controlledOpen !== undefined;

  const isOpen = isControlled ? controlledOpen : disclosure.isOpen;
  const onOpen = disclosure.onOpen;
  const onClose = isControlled ? controlledClose : disclosure.onClose;

  const Trigger = trigger ? (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen();
        }
      }}
      className="inline-flex cursor-pointer items-center justify-center"
    >
      {trigger}
    </div>
  ) : null;

  return (
    <>
      {Trigger}

      <Modal
        {...modalProps}
        classNames={{
          base: 'bg-content1 rounded-lg',
        }}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent className="max-h-[90vh] overflow-hidden">
          {(close) => {
            const render = (node: ReactNode | ModalRenderFn) =>
              typeof node === 'function' ? node(close) : node;

            return (
              <>
                {header && <ModalHeader>{header}</ModalHeader>}
                <ModalBody className="overflow-y-auto">{render(children)}</ModalBody>
                {footer && <ModalFooter>{render(footer)}</ModalFooter>}
              </>
            );
          }}
        </ModalContent>
      </Modal>
    </>
  );
}

'use client';

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalProps,
} from '@heroui/react';
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ReactElement, ReactNode } from 'react';

type ModalRenderFn = (onClose: () => void) => ReactNode;
export type ForwardedModalProps = Omit<
  ModalProps,
  'children' | 'isOpen' | 'onClose' | 'onOpenChange'
>;

export interface MainModalProps {
  trigger?: ReactNode;
  header?: ReactNode;
  footer?: ReactNode | ModalRenderFn;
  modalProps?: ForwardedModalProps;
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode | ModalRenderFn;
}

interface MainModalTriggerProps {
  children: ReactNode;
}

export function MainModalTrigger({ children }: MainModalTriggerProps) {
  return <>{children}</>;
}

(MainModalTrigger as { __MAIN_MODAL_TRIGGER?: boolean }).__MAIN_MODAL_TRIGGER = true;

function isTriggerElement(node: ReactNode): node is ReactElement<MainModalTriggerProps> {
  if (!isValidElement(node)) {
    return false;
  }

  if (node.type === MainModalTrigger) {
    return true;
  }

  return Boolean((node.type as { __MAIN_MODAL_TRIGGER?: boolean }).__MAIN_MODAL_TRIGGER);
}

function bindTrigger(triggerNode: ReactNode, open: () => void): ReactNode {
  if (!triggerNode) {
    return null;
  }

  if (!isValidElement(triggerNode)) {
    return (
      <button type="button" onClick={open}>
        {triggerNode}
      </button>
    );
  }

  // Fragments cannot receive handlers, so wrap them in a keyboard-accessible fallback.
  if (triggerNode.type === Fragment) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        }}
      >
        {triggerNode}
      </span>
    );
  }

  const triggerProps = triggerNode.props as {
    onClick?: (...args: unknown[]) => void;
    onPress?: (...args: unknown[]) => void;
  };

  let skipNextClick = false;

  return cloneElement(triggerNode as ReactElement<Record<string, unknown>>, {
    onClick: (...args: unknown[]) => {
      if (skipNextClick) {
        skipNextClick = false;
        return;
      }

      triggerProps.onClick?.(...args);
      const firstArg = args[0] as { defaultPrevented?: boolean } | undefined;
      if (!firstArg?.defaultPrevented) {
        open();
      }
    },
    onPress: (...args: unknown[]) => {
      skipNextClick = true;
      triggerProps.onPress?.(...args);
      const firstArg = args[0] as { defaultPrevented?: boolean } | undefined;
      if (!firstArg?.defaultPrevented) {
        open();
      }
    },
  });
}

export default function MainModalClient({
  trigger,
  header,
  footer,
  modalProps,
  isOpen: controlledIsOpen,
  defaultOpen = false,
  onOpen,
  onClose,
  onOpenChange,
  children,
}: MainModalProps) {
  const isControlled = controlledIsOpen !== undefined;
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(defaultOpen);

  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;
  const openStateRef = useRef(isOpen);

  useEffect(() => {
    openStateRef.current = isOpen;
  }, [isOpen]);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (openStateRef.current === nextOpen) {
        return;
      }

      openStateRef.current = nextOpen;

      if (!isControlled) {
        setUncontrolledIsOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);

      if (nextOpen) {
        onOpen?.();
      } else {
        onClose?.();
      }
    },
    [isControlled, onClose, onOpen, onOpenChange]
  );

  const closeModal = useCallback(() => setOpen(false), [setOpen]);
  const openModal = useCallback(() => setOpen(true), [setOpen]);

  let triggerFromChildren: ReactNode = null;
  let bodyContent: ReactNode;

  if (typeof children === 'function') {
    bodyContent = children(closeModal);
  } else {
    const content: ReactNode[] = [];

    for (const child of Children.toArray(children)) {
      if (isTriggerElement(child)) {
        if (triggerFromChildren === null) {
          triggerFromChildren = child.props.children;
        }
        continue;
      }

      content.push(child);
    }

    bodyContent = content;
  }

  const resolvedTrigger = trigger ?? triggerFromChildren;
  const boundTrigger = bindTrigger(resolvedTrigger, openModal);
  const needsKeyboardFallback =
    !isValidElement(resolvedTrigger) || resolvedTrigger.type === Fragment;

  const { classNames, ...restModalProps } = modalProps ?? {};
  const mergedClassNames = useMemo(
    () => ({
      ...classNames,
      base: ['bg-content1 rounded-lg', classNames?.base].filter(Boolean).join(' '),
    }),
    [classNames]
  );

  return (
    <>
      {boundTrigger && (
        <span
          className="inline-flex"
          role={needsKeyboardFallback ? 'button' : undefined}
          tabIndex={needsKeyboardFallback ? 0 : undefined}
          onClick={(event) => {
            if (!event.defaultPrevented) {
              openModal();
            }
          }}
          onKeyDown={(event) => {
            if (!needsKeyboardFallback) {
              return;
            }

            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              openModal();
            }
          }}
        >
          {boundTrigger}
        </span>
      )}

      <Modal
        data-cy="main-modal"
        {...restModalProps}
        isOpen={isOpen}
        onClose={closeModal}
        onOpenChange={setOpen}
        classNames={mergedClassNames}
      >
        <ModalContent className="max-h-[90vh] overflow-hidden">
          {() => (
            <>
              {header && <ModalHeader><h2>{header}</h2></ModalHeader>}

              <ModalBody className="overflow-y-auto">{bodyContent}</ModalBody>

              {footer && (
                <ModalFooter>
                  {typeof footer === 'function' ? footer(closeModal) : footer}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

'use client';

import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { ReactElement, ReactNode } from 'react';

type ModalRenderFn = (onClose: () => void) => ReactNode;
export interface ForwardedModalProps {
  size?: string;
  backdrop?: string;
  isDismissable?: boolean;
  className?: string;
}

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
  __mainModalTrigger?: boolean;
}

export function MainModalTrigger({ children }: MainModalTriggerProps) {
  return <>{children}</>;
}

(MainModalTrigger as { __MAIN_MODAL_TRIGGER?: boolean }).__MAIN_MODAL_TRIGGER = true;

function isTriggerElement(node: ReactNode): node is ReactElement<MainModalTriggerProps> {
  if (!isValidElement(node)) {
    return false;
  }

  const nodeProps = node.props as { __mainModalTrigger?: boolean };
  if (nodeProps?.__mainModalTrigger === true) {
    return true;
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

  const normalizedChildren = Children.toArray(triggerNode).filter(
    (child) => typeof child !== 'string' || child.trim().length > 0
  );

  if (normalizedChildren.length === 0) {
    return null;
  }

  const finalTriggerNode =
    normalizedChildren.length > 1 ? <>{normalizedChildren}</> : normalizedChildren[0];

  if (!isValidElement(finalTriggerNode)) {
    return (
      <button type="button" onClick={open}>
        {finalTriggerNode}
      </button>
    );
  }

  // Fragments cannot receive handlers, so wrap them in a keyboard-accessible fallback.
  if (finalTriggerNode.type === Fragment) {
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
        {finalTriggerNode}
      </span>
    );
  }

  const triggerProps = finalTriggerNode.props as {
    onClick?: (...args: unknown[]) => void;
    onPress?: (...args: unknown[]) => void;
  };

  return cloneElement(finalTriggerNode as ReactElement<Record<string, unknown>>, {
    onClick: (...args: unknown[]) => {
      triggerProps.onClick?.(...args);
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

  const modalSize =
    modalProps?.size === '5xl'
      ? 'max-w-5xl'
      : modalProps?.size === '4xl'
        ? 'max-w-4xl'
        : modalProps?.size === '3xl'
          ? 'max-w-3xl'
          : modalProps?.size === '2xl'
            ? 'max-w-2xl'
            : 'max-w-xl';

  return (
    <>
      {boundTrigger && <span className="inline-flex h-full w-full">{boundTrigger}</span>}

      {isOpen && (
        <div
          data-cy="main-modal"
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 ${modalProps?.backdrop === 'blur' ? 'backdrop-blur-sm' : ''}`}
          onClick={(event) => {
            if (event.target === event.currentTarget && modalProps?.isDismissable !== false) {
              closeModal();
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape' && modalProps?.isDismissable !== false) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={header ? 'main-modal-title' : undefined}
            className={`relative max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-5 shadow-xl ${modalSize} ${modalProps?.className ?? ''}`}
          >
            <button
              type="button"
              aria-label="Close dialog"
              className="absolute top-3 right-3 z-10 rounded-full p-2 hover:bg-neutral-100"
              onClick={closeModal}
            >
              ×
            </button>
            {header && (
              <header id="main-modal-title" className="mb-4 pr-8">
                <h2>{header}</h2>
              </header>
            )}
            <div className="overflow-y-auto">{bodyContent}</div>
            {footer && (
              <footer className="mt-4">
                {typeof footer === 'function' ? footer(closeModal) : footer}
              </footer>
            )}
          </section>
        </div>
      )}
    </>
  );
}

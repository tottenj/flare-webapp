'use client';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment} from 'react';

type ModalProps = {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  returnTo?: string;
  back?: boolean;
};

export default function Modal({
  isOpen,
  onClose = () => {},
  children,
  returnTo,
  back,
}: ModalProps) {
  const router = useRouter();
  const pathname = usePathname();
  let open = isOpen;
  if (isOpen == undefined) {
    open = pathname.includes('/event')
  }

  if (returnTo) {
    onClose = async () => {
      isOpen = false;
      router.push(returnTo);
    };
  } else if (back) {
    onClose = () => router.back();
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="bg-background fixed inset-0 transition-opacity"
            style={{ opacity: 0.8 }}
          />
        </TransitionChild>
        {/* Modal panel */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="h-2/3 min-h-3/5 w-full max-w-3/4 transform overflow-auto rounded-2xl bg-white p-12 shadow-xl transition-all">
              {children}
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}

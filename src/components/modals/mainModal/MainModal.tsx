'use client';

import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';

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
}: ModalProps) {
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 w-full" onClose={onClose}>
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
          <div className="bg-opacity-25 gradientBack fixed inset-0" />
        </TransitionChild>

        {/* Modal container */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="relative w-11/12 max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all md:w-full md:p-6">
                {/* X button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 z-10 cursor-pointer rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus:ring-2 focus:ring-gray-300 focus:outline-none"
                  aria-label="Close"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {children}
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

'use client';

import { useState } from 'react';
import Modal from '../mainModal/MainModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, IconDefinition } from '@fortawesome/free-solid-svg-icons';

export default function EditModal({
  children,
  icon = faPencil,
}: {
  children: React.ReactNode;
  icon?: IconDefinition;
}) {
  const [open, setIsOpen] = useState(false);

  function openModal(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    event.preventDefault();
    setIsOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="pointer-cursor gradient group flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 p-1 transition-transform duration-200 ease-in-out hover:scale-110"
      >
        <FontAwesomeIcon
          className="group-hover:text-foreground text-white ease-in-out"
          icon={icon}
        />
      </button>

      <Modal isOpen={open} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
}

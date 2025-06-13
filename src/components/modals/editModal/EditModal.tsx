'use client';

import { useState } from 'react';
import Modal from '../mainModal/MainModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';

export default function EditModal({children}: {children: React.ReactNode}) {
  const [open, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="pointer-cursor gradient group  flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 p-1"
      >
        <FontAwesomeIcon
          className="group-hover:text-foreground text-white ease-in-out"
          icon={faPencil}
        />
      </button>

      <Modal isOpen={open} onClose={() => setIsOpen(false)}>
        {children}
      </Modal>
    </>
  );
}

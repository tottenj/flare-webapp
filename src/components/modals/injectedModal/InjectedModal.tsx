'use client';
import { useState, cloneElement, isValidElement, ReactElement, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import Modal from '../mainModal/MainModal';

// 👇 define what props the child must accept
export interface InjectedCloseProp {
  close: () => void;
}

interface EditModalProps {
  children: ReactElement<Partial<InjectedCloseProp>>;
  trigger: React.ReactNode
}

export default function InjectedModal({ children, trigger }: EditModalProps) {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  return (
    <>
    <button onClick={() => setOpen(true)}>
     {trigger}
     </button>
      <Modal onClose={handleClose} isOpen={open}>
        {isValidElement(children)
          ? cloneElement(children, {
              ...children.props, // preserve existing props
              close: handleClose, // inject close function
            })
          : null}
      </Modal>
    </>
  );
}

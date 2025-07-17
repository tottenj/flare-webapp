"use client"
import React, { useState } from 'react';
import Modal from '../mainModal/MainModal';

export default function PassInModal({
  children,
  trigger,
}: {
  children: React.ReactNode;
  trigger?: React.ReactElement<any>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {trigger &&
        React.cloneElement(trigger, {
          onClick: (e: MouseEvent) => {
            if (typeof trigger.props.onClick === 'function') {
              trigger.props.onClick(e);
            }
            setOpen(true);
          },
        })}
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        {children}
      </Modal>
    </>
  );
}

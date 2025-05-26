"use client"
import { useState } from 'react';
import Modal from '../mainModal/MainModal';
import AddEventForm from '@/components/forms/addEventForm/AddEventForm';
import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';

export default function AddEventModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className='flex justify-end w-full' onClick={() => setOpen(true)}><SquarePlus/></button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <AddEventForm setClose={setOpen}/>
      </Modal>
    </>
  );
}

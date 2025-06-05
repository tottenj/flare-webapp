"use client"
import { useState } from 'react';
import Modal from '../mainModal/MainModal';
import AddEventForm from '@/components/forms/addEventForm/AddEventForm';
import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/auth/configs/clientApp';

export default function AddEventModal() {
  const [open, setOpen] = useState(false);

  async function addMyself(){
      const func = httpsCallable(functions, "addMyself")
      await func()
  }

  return (
    <>
      <button className='flex justify-end w-full' onClick={() => setOpen(true)}><SquarePlus/></button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <AddEventForm setClose={setOpen}/>
        <button onClick={addMyself}>ADD MYSLF TO ADMIN</button>
      </Modal>
    </>
  );
}

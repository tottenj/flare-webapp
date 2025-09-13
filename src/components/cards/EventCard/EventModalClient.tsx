'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import Modal from '@/components/modals/mainModal/MainModal';

type Props = {
  eventId: string;
  back?: boolean; // optional, navigate back if true
};

export default function EventModalClient({ eventId, back }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

 
  const returnTo = pathname || '/events';

  const handleClose = () => {
    setIsOpen(false); // triggers animation
    setTimeout(() => {
      if (back) router.back();
      else router.push(returnTo);
    }, 200); // match leave animation duration
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="relative h-full">
        <EventInfoContainer slug={eventId} />
      </div>
    </Modal>
  );
}

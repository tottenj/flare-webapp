"use client"
import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';

export default function CreateEventModalWrapper({ orgName }: { orgName: string }) {
  return (
    <MainModal
      trigger={<SquarePlus />}
      header={<span className="block w-full text-center">Create New Event</span>}
      modalProps={{ size: '3xl', isDismissable: false }}
    >
      {(close) => <EventFormContainer orgName={orgName} onCloseModal={close} />}
    </MainModal>
  );
}

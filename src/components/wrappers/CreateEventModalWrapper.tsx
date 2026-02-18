"use client"
import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';

export default function CreateEventModalWrapper({ orgName }: { orgName: string }) {
  return (
    <MainModal
      trigger={<SquarePlus />}
      header={<h2 className="w-full text-center">Create New Event</h2>}
      modalProps={{ size: '3xl', isDismissable: false }}
    >
      {(close) => <EventFormContainer orgName={orgName} onCloseModal={close} />}
    </MainModal>
  );
}

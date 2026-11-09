'use client';
import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import EventFormContainer from '@/components/forms/eventForm/EventFormContainer';
import MainModal from '@/components/modals/MainModal/MainModal';
import createEvent from '@/lib/serverActions/events/createEvent/createEvent';

export default function CreateEventModalWrapper({
  orgName,
  organizationId,
}: {
  orgName: string;
  organizationId: string;
}) {
  return (
    <MainModal
      trigger={<SquarePlus />}
      header={<h2 className="w-full text-center">Create New Event</h2>}
      modalProps={{ size: '3xl', isDismissable: false }}
    >
      {(close) => (
        <EventFormContainer
          orgName={orgName}
          onCloseModal={close}
          submitAction={createEvent.bind(null, organizationId)}
        />
      )}
    </MainModal>
  );
}

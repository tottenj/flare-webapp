import SquarePlus from '@/components/buttons/squarePlus/SquarePlus';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import AddEventFormHero from '@/components/forms/addEventForm/AddEventFormHero';
import InjectedModal from '@/components/modals/injectedModal/InjectedModal';
import isOrganization from '@/lib/utils/authentication/isOrganization';

export default async function EventDetails({ eventId }: { eventId?: string }) {
  const org = await isOrganization();

  return (
    <div data-cy="eventDetails" className="hidden rounded-2xl bg-white md:block">
      {eventId ? (
        <EventInfoContainer slug={eventId} />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center text-[#b3b3b3]">
          <p className="mb-2">
            Your next upcoming event will appear here. {org && 'Start by creating one!'}
          </p>
          {org && (
            <InjectedModal trigger={<SquarePlus />}>
              <AddEventFormHero />
            </InjectedModal>
          )}
        </div>
      )}
    </div>
  );
}

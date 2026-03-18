import EditEvent from '@/components/events/EditEvent/EditEvent';
import EventList from '@/components/events/EventList/presentational/EventList';
import MainModal from '@/components/modals/MainModal/MainModal';
import { EventService } from '@/lib/services/eventService/eventService';
import { AuthenticatedOrganization } from '@/lib/types/AuthenticatedOrganization';
import { EventDto } from '@/lib/types/dto/EventDto';
import { OrgEventFilter } from '@/lib/types/OrgEventFilter';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default async function EventListContainerOrg({
  actor,
  filters,
}: {
  actor: AuthenticatedOrganization;
  filters?: OrgEventFilter;
}) {
  let events: EventDto[] = [];
  try {
    events = await EventService.listEventsOrg(actor, filters);
  } catch (error) {
    console.log(error);
  }
  return (
    <EventList
      events={events}
      renderActions={(event) => (
        <MainModal
          modalProps={{ size: '5xl' }}
          trigger={
            <button className="hover:text-primary flex h-8 w-8 items-center justify-center rounded-full p-2 transition-all duration-200 ease-in-out hover:cursor-pointer hover:bg-white">
              <FontAwesomeIcon className="h-full w-full" icon={faEdit} />
            </button>
          }
        >
          <EditEvent event={event} />
        </MainModal>
      )}
    />
  );
}

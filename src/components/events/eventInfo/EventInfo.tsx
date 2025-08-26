'use server';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import BookmarkButton from '@/components/buttons/bookmarkButton/BookmarkButton';
import PassInModal from '@/components/modals/passInModal/PassInModal';
import AddEventFormHero from '@/components/forms/addEventForm/AddEventFormHero';
import EventInfoSplit from './EventInfoSplit';
import deleteEvent from '@/lib/formActions/deleteEvent/deleteEvent';
import DeleteButton from '@/components/buttons/deleteButton/DeleteButton';

interface EventInfoProps {
  img?: string | null;
  event: Event;
  org?: FlareOrg | null;
  seen: boolean;
  curUserId?: string;
}

export default async function EventInfo({ img, event, org, seen, curUserId }: EventInfoProps) {
  if (!event) return null;

  const formattedDate = event.startdate.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const editDelete =
    event.flare_id === curUserId ? (
      <div className="absolute top-1 left-1 flex gap-4">
       <DeleteButton formAction={deleteEvent} id={event.id}/>
        <PassInModal
          trigger={
            <div className="pointer-cursor gradient group flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 p-1 transition-transform duration-200 ease-in-out hover:scale-110">
              <FontAwesomeIcon className="group-hover:text-foreground text-white" icon={faPencil} />
            </div>
          }
        >
          <AddEventFormHero />
        </PassInModal>
      </div>
    ) : undefined;

  const bookmark = event.flare_id !== curUserId && <BookmarkButton event={event.id} seen={seen} />;

  return (
    <EventInfoSplit
      editDelete={editDelete}
      bookMark={bookmark}
      event={event}
      formattedDate={formattedDate}
      img={img}
      orgName={org?.name}
      startDate={event.startdate.toLocaleTimeString()}
    />
  );
}

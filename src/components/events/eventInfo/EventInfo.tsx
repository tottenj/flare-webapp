'use client';
import Event from '@/lib/classes/event/Event';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendar,
  faClock,
  faDollarSign,
  faLocationDot,
  faPencil,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import BookmarkButton from '@/components/buttons/bookmarkButton/BookmarkButton';
import PassInModal from '@/components/modals/passInModal/PassInModal';
import AddEventFormHero from '@/components/forms/addEventForm/AddEventFormHero';
import deleteEvent from '@/lib/formActions/deleteEvent/deleteEvent';
import DeleteButton from '@/components/buttons/deleteButton/DeleteButton';
import Image from 'next/image';
import SecondaryHeader from '@/components/info/toolTip/secondaryHeader/SecondaryHeader';
import PrimaryLink from '@/components/Links/PrimaryLink/PrimaryLink';
import useUnifiedUser from '@/lib/hooks/useUnifiedUser';

interface EventInfoProps {
  img?: string | null;
  event: Partial<Event>;
  orgName?: string | null;
  seen: boolean;
  startDateString: string;
  startTimeString: string;
}

export default function EventInfo({
  img,
  event,
  orgName,
  seen,
  startDateString,
  startTimeString,
}: EventInfoProps) {
  const { user } = useUnifiedUser();
  const curUserId = user?.uid;

  const editDelete =
    event.flare_id === curUserId && event.id ? (
      <div className="absolute top-1 left-1 flex gap-4">
        <DeleteButton formAction={deleteEvent} id={event.id} />
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

  const bookmark = event.flare_id !== curUserId && event.id && event.id !== "123" && (
    <BookmarkButton event={event.id} seen={seen} />
  );

  return (
    <div className="relative mx-auto flex max-w-5xl min-w-3/4 flex-col rounded-2xl bg-white p-4">
      {editDelete}
      <div className="grid items-start gap-6 rounded-2xl bg-white p-6 transition-all duration-300 md:grid-cols-[1fr_1.2fr]">
        {bookmark}
        <div className="relative aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-xl md:aspect-[3/4]">
          {img && <Image src={img} alt="Event Image" fill className="object-cover object-top" />}
        </div>
        <div className="flex flex-col">
          <h2 className="text-center text-4xl font-bold mb-4 font-black">{event.title}</h2>
          {orgName && <p className="mb-4 text-center">{orgName}</p>}

          <SecondaryHeader header={<FontAwesomeIcon icon={faCalendar} />} text={startDateString} />
          <SecondaryHeader header={<FontAwesomeIcon icon={faClock} />} text={startTimeString} />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faLocationDot} />}
            text={event.location?.name}
          />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faDollarSign} />}
            text={event.price?.toString() ?? 'Free'}
          />
          <SecondaryHeader header={<FontAwesomeIcon icon={faUsers} />} text={event.ageGroup} />
          <div className="mt-4 text-sm leading-relaxed text-gray-800">{event.description}</div>
        </div>

        {event.ticketLink && (
          <PrimaryLink link={event.ticketLink} linkText="🎟 Purchase Ticket" center />
        )}
      </div>
    </div>
  );
}

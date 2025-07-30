'use server';
import Event from '@/lib/classes/event/Event';
import Image from 'next/image';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faClock } from '@fortawesome/free-regular-svg-icons';
import { faLocationDot, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import SecondaryHeader from '../../info/toolTip/secondaryHeader/SecondaryHeader';
import BookmarkButton from '@/components/buttons/bookmarkButton/BookmarkButton';

interface EventInfoProps {
  img?: string | null;
  event: Event;
  org?: FlareOrg | null;
  seen: boolean;
  curUserId?: string;
}
export default async function EventInfo({ img, event, org, seen, curUserId }: EventInfoProps) {
  if (!event) {
    return <></>;
  }

  const formattedDate = event.startdate.toLocaleDateString('en-US', {
    weekday: 'short', // Tue
    month: 'long', // June
    day: 'numeric', // 19
    year: 'numeric', // 2025
  });

  return (
    <div className="relative mx-auto flex max-w-5xl flex-col p-4 bg-white rounded-2xl min-w-3/4">
      <div className="grid items-start gap-6 rounded-2xl bg-white p-6 transition-all duration-300 md:grid-cols-[1fr_1.2fr]">
        {event.flare_id !== curUserId && <BookmarkButton event={event.id} seen={seen} />}
        <div className="relative aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-xl md:aspect-[3/4]">
          {img && <Image src={img} alt="Event Image" fill className="object-cover object-top" />}
        </div>
        <div className="flex flex-col">
          <h2 className="text-center !text-4xl font-bold md:text-4xl">{event.title}</h2>
          <p className="mb-4 text-center">{org?.name}</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700"></div>
          <SecondaryHeader header={<FontAwesomeIcon icon={faCalendar} />} text={formattedDate} />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faClock} />}
            text={event.startdate.toLocaleTimeString()}
          />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faLocationDot} />}
            text={event.location.name}
          />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faDollarSign} />}
            text={event.price.toString()}
          />
          <SecondaryHeader header={<FontAwesomeIcon icon={faUsers} />} text={event.ageGroup} />
          <div className="mt-4 text-sm leading-relaxed text-gray-800">{event.description}</div>
        </div>
      </div>

      {event.ticketLink && (
        <Link
          className="bg-primary hover:border-primary hover:text-primary mt-8 w-full self-center rounded-xl px-5 py-3 text-center text-lg font-semibold text-white transition hover:border-4 hover:bg-white"
          href={event.ticketLink}
        >
          🎟 Purchase Ticket
        </Link>
      )}
    </div>
  );
}

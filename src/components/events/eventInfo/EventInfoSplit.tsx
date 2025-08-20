import SecondaryHeader from "@/components/info/toolTip/secondaryHeader/SecondaryHeader";
import PrimaryLink from "@/components/Links/PrimaryLink/PrimaryLink";
import Event from "@/lib/classes/event/Event";
import { faCalendar, faClock, faDollarSign, faLocationDot, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface EventInfoSplitProps {
  editDelete?: React.ReactNode;
  bookMark?: React.ReactNode;
  event: Partial<Omit<Event, 'startDate' | 'endDate'>>; 
  formattedDate: string;
  img?: string | null
  orgName?:string
  startDate?: string | null
}

export default function EventInfoSplit({ editDelete, bookMark, event, formattedDate, img, orgName,startDate}: EventInfoSplitProps) {
  return (
    <div className="relative mx-auto flex max-w-5xl min-w-3/4 flex-col rounded-2xl bg-white p-4">
      {editDelete}
      <div className="grid items-start gap-6 rounded-2xl bg-white p-6 transition-all duration-300 md:grid-cols-[1fr_1.2fr]">
        {bookMark}
        <div className="relative aspect-[4/3] max-h-[500px] w-full overflow-hidden rounded-xl md:aspect-[3/4]">
          {img && <Image src={img} alt="Event Image" fill className="object-cover object-top" />}
        </div>
        <div className="flex flex-col">
          <h2 className="text-center !text-4xl font-bold md:text-4xl">{event.title}</h2>
          <p className="mb-4 text-center">{orgName}</p>
          <div className="flex flex-col gap-2 text-sm text-gray-700"></div>
          <SecondaryHeader header={<FontAwesomeIcon icon={faCalendar} />} text={formattedDate} />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faClock} />}
            text={startDate}
          />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faLocationDot} />}
            text={event.location?.name}
          />
          <SecondaryHeader
            header={<FontAwesomeIcon icon={faDollarSign} />}
            text={event.price?.toString()}
          />
          <SecondaryHeader header={<FontAwesomeIcon icon={faUsers} />} text={event.ageGroup} />
          <div className="mt-4 text-sm leading-relaxed text-gray-800">{event.description}</div>
        </div>

        {event.ticketLink && (
          <>
            <PrimaryLink link={event.ticketLink} linkText=" 🎟 Purchase Ticket" center />
          </>
        )}
      </div>
    </div>
  );
}

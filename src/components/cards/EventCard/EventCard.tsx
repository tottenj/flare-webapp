'use server';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import Event, { PlainEvent } from '@/lib/classes/event/Event';
import isSameDate from '@/lib/utils/dateTime/isSameDate';
import isSameTime from '@/lib/utils/dateTime/isSameTime';
import EventCardLink from './EventCardLink';
import { ensureEvent } from '@/lib/utils/other/ensureEvent';
import ModalLink from '@/components/modals/Hero/ModalLink/ModalLink';

interface eventCardProps {
  event: Event | PlainEvent;
  returnTo?:string
}




export default async function EventCard({ event, returnTo }: eventCardProps) {
  event = ensureEvent(event)


  const sameDate = isSameDate(event.startDate, event.endDate);
  const sameTime = isSameTime(event.startDate, event.endDate);

  return (
    <ModalLink id={event.id}>
      <div
        style={{ background: `${event.type}` }}
        className="flex justify-end rounded-[16px] p-1 transition-transform duration-200 hover:scale-105"
      >
        <div className="relative flex w-[95%] items-center justify-start gap-4 rounded-[15px] bg-white p-2">
          <SVGLogo color={event.type} size={50} />
          <div className="flex flex-col justify-center">
            <h4>{event.title}</h4>
            <p className="text-sm">
              {event.startDate.toDateString()} {!sameDate && ' -- ' + event.endDate.toDateString()}
            </p>

            <p className="hidden text-sm md:block">
              {event.startDate.toLocaleTimeString()}{' '}
              {!sameTime && ' -- ' + event.endDate.toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </ModalLink>
  );
}

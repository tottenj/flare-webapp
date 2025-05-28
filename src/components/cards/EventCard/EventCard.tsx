'use client';
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import { PlainEvent } from '@/lib/classes/event/Event';

import Link from 'next/link';


interface eventCardProps {
  event: PlainEvent;
}
export default function EventCard({ event }: eventCardProps) {
  return (
    <Link href={`/events/(.)${event.id}`} as={`/events/${event.id}`} scroll={false}>
      <div
        style={{ background: `${event.type}` }}
        className="flex justify-end rounded-2xl bg-white p-1"
      >
        <div className="flex w-[95%] justify-start gap-4 rounded-lg bg-white p-2">
          <SVGLogo color={event.type} size={50} />
          <div className="flex flex-col justify-center">
            <h4>{event.title}</h4>
            <p className="text-sm">{event.startDate}</p>
            <p className="text-sm">{event.endDate}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import Event from '@/lib/classes/event/Event';
import Image from 'next/image';

interface eventCardProps {
  event: Event;
}
export default function EventCard({ event }: eventCardProps) {
  return (
    <div
      style={{ background: `${event.type}` }}
      className="flex justify-end rounded-2xl bg-white p-1"
    >
      <div className="flex w-[95%] justify-start gap-4 rounded-lg bg-white p-2">
        <SVGLogo color={event.type} size={50} />
        <div className="flex flex-col justify-center">
          <h4>{event.title}</h4>
          <p className="text-sm">{event.date.toDateString()}</p>
        </div>
      </div>
    </div>
  );
}

import Event from '@/lib/classes/event/Event';
import Image from 'next/image';

interface eventCardProps {
  event: Event;
  key?: string
}
export default function EventCard({ event, key }: eventCardProps) {
  return (
    <div key={key ?? ""} style={{background: `${event.type}`}} className="rounded-2xl bg-white flex justify-end p-1">
      <div className="flex justify-start gap-4 rounded-lg bg-white w-[95%] p-2">
        <Image src={'/Flare.png'} width={50} height={50} alt="logo" />
        <div className="flex flex-col justify-center">
          <h4>{event.title}</h4>
          <p className="text-sm">{event.date.toDateString()}</p>
        </div>
      </div>
    </div>
  );
}

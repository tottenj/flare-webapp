"use client"
import SVGLogo from '@/components/flare/svglogo/SVGLogo';
import Event from '@/lib/classes/event/Event';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export type PlainEvent = {
  id: string;
  flare_id: string;
  title: string;
  description: string;
  type: string;
  ageGroup: string;
  date: string; // ISO string
  location: {
    id: string;
    name?: string | null;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  price?: number | string;
  ticketLink?: string;
};


interface eventCardProps {
  event: PlainEvent;
}
export default function EventCard({ event }: eventCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/events/${event.id}`)}
      style={{ background: `${event.type}` }}
      className="flex justify-end rounded-2xl bg-white p-1"
    >
      <div className="flex w-[95%] justify-start gap-4 rounded-lg bg-white p-2">
        <SVGLogo color={event.type} size={50} />
        <div className="flex flex-col justify-center">
          <h4>{event.title}</h4>
          <p className="text-sm">{event.date}</p>
        </div>
      </div>
    </div>
  );
}

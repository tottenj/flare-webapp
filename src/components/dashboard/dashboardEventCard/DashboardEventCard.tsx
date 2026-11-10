import FlareLogo from '@/components/flare/configurableLogo/ConfigurableLogo';
import Image from 'next/image';
import Link from 'next/link';

export type DashboardEvent = {
  id: string;
  title: string;
  imageUrl?: string | null;
  startDateLabel: string;
  startTimeLabel: string;
  monthLabel: string;
  dayLabel: string;
  locationLabel: string;
  priceLabel: string;
  organizerName?: string;
};

export default function DashboardEventCard({
  event,
  featured = false,
}: {
  event: DashboardEvent;
  featured?: boolean;
}) {
  return (
    <Link href={`/events/${event.id}`}  className="flex h-full min-w-0 items-center gap-4 p-4 sm:gap-6 hover:bg-accent-soft transition-all duration-300">
        
      <div
        className={`relative aspect-3/4 shrink-0 overflow-hidden rounded-sm ${featured ? 'w-28 sm:w-44 md:w-40 lg:w-52' : 'w-20 sm:w-24'}`}
      >
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt=""
            fill
            sizes={
              featured
                ? '(min-width: 1024px) 208px, (min-width: 768px) 160px, (min-width: 640px) 176px, 112px'
                : '(min-width: 640px) 96px, 80px'
            }
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-surface text-white">
            <span className="mt-1 text-sm font-bold uppercase">{event.monthLabel}</span>
            <span className="font-heading text-3xl leading-none font-bold">{event.dayLabel}</span>
          </div>
        )}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="text-accent text-xs font-bold uppercase">
          {event.startDateLabel} / {event.startTimeLabel}
        </p>
        <h3
          className={`font-heading font-bold break-words ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}
        >
          {event.title}
        </h3>
        <p className="text-muted text-sm">
          {event.locationLabel} - <strong>{event.priceLabel}</strong>
        </p>
        {event.organizerName && <p className="text-muted text-sm">{event.organizerName}</p>}
      </div>
    </Link>
   
  );
}

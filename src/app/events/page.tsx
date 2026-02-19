import EventListContainerEvents from '@/components/events/EventList/EventListContainerEvents';
import { Suspense } from 'react';

export default async function page() {
  return (
    <div className="flex h-full w-full">
      <div className="w-3/4"></div>
      <div className="w-1/4 rounded-2xl bg-white shadow-2xl">
        <Suspense>
          <EventListContainerEvents />
        </Suspense>
      </div>
    </div>
  );
}

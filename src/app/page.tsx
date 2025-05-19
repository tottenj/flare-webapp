import MainBanner from '@/components/banners/mainBanner/MainBanner';
import FullPageCalendar from '@/components/calendars/calendar/Calendar';
import EventCard from '@/components/cards/EventCard/EventCard';
import Event from '@/lib/classes/event/Event';

export default function Dashboard() {
  const events = Event.sampleEvents;
  const plain = events.map((event) => event.toPlain());

  return (
    <>
      <MainBanner />
      <div className="gradientBack flex gap-12 p-4 pt-8">
        <div className="w-3/5">
          <FullPageCalendar events={plain} />
        </div>
        <div className="flex h-[700] w-2/5 flex-col gap-4 overflow-scroll">
          {events.map((even) => (
            <EventCard event={even} />
          ))}
        </div>
      </div>
    </>
  );
}

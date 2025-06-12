'use server';
import EventInfo from '@/components/events/EventInfo';

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return <p>Event not found</p>;

  return (
    <>
      <div className="eventPage">
        <EventInfo slug={slug} />
      </div>
    </>
  );
}

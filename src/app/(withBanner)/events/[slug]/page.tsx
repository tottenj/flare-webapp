'use server';
import EventInfo from '@/components/events/EventInfo';

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return <p>Event not found</p>;

  return (
    <>
      <div className="relative flex items-center justify-center rounded-2xl bg-white p-4 w-9/10 m-auto mt-[36px] h-auto max-h-[75dvh] overflow-x-hidden overflow-y-auto">
        <EventInfo slug={slug} />
      </div>
    </>
  );
}

'use server';
import MainBanner from '@/components/banners/mainBanner/MainBanner';
import EventInfo from '@/components/events/EventInfo';

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!slug) return <p>Event not found</p>;

  return (
    <>
      <div className="mt-[-4rem] flex h-dvh items-center justify-center">
        <EventInfo slug={slug} />
      </div>
    </>
  );
}

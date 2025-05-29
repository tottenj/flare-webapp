"use server"
import MainBanner from "@/components/banners/mainBanner/MainBanner";
import EventInfo from "@/components/events/EventInfo";
import Event from "@/lib/classes/event/Event";
import { getFirestoreFromServer } from "@/lib/firebase/auth/configs/getFirestoreFromServer";

export default async function FullEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const {slug} = await params
  if (!slug) return <p>Event not found</p>;

  return (
    <>
    <MainBanner/>
    <div className="h-dvh mt-[-4rem] flex justify-center items-center ">
    <EventInfo slug={slug}/>
    </div>
    </>
  );
}

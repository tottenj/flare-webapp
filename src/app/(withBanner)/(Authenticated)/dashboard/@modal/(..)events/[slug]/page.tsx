"use server"
import EventModalInterception from '@/app/(withBanner)/events/@modal/(.)[slug]/page';
import EventInfo from '@/components/events/EventInfo';
import Modal from '@/components/modals/mainModal/MainModal';


export default async function page({ params }: { params: Promise<{ slug: string }> }) {

  return (
    <EventModalInterception params={params}/>
  );
}

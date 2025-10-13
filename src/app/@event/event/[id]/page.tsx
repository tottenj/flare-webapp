"use server"
import EventModalClient from '@/components/cards/EventCard/EventModalClient';
import EventInfoContainer from '@/components/events/eventInfo/EventInfoContainer';
import { getFirestoreFromStatic } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string; back?: string }>;
}) {
  const { id } = await params;
  const {returnTo} = await searchParams
 

  getFirestoreFromStatic()
  

  return <EventModalClient returnTo={returnTo}>
    <EventInfoContainer slug={id}/>
  </EventModalClient>;
}

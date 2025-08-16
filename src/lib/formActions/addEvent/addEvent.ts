"use server"
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import AgeGroup from '@/lib/enums/AgeGroup';
import eventType from '@/lib/enums/eventType';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import flareLocation from '@/lib/types/Location';
import { convertFormData } from '@/lib/zod/convertFormData';
import { revalidatePath } from 'next/cache';

export default async function addEvent(prevState: any, formData: FormData) {
  const { currentUser, fire } = await getFirestoreFromServer();
  if (!currentUser) return { message: 'Unable to find current user', eventId: null };


  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const start = formData.get('start') as string;
    const startDate = new Date(start);
    const end = formData.get('end') as string;
    const endDate = new Date(end);
    const type = formData.get('type-select') as keyof typeof eventType
    const ageGroup = formData.get('age') as keyof typeof AgeGroup;

    const price = formData.get('price') as string;
    const ticketLink = formData.get('tickets') as string;
    const locationString = formData.get('location') as string;
 
    const location: flareLocation | null = locationString ? JSON.parse(locationString) : null;
    if (!location) throw new Error('Invalid Location');

    const org = await FlareOrg.getOrg(fire, currentUser.uid)
    const verified = org?.verified ?? false


    const event = new Event(
      currentUser.uid,
      title,
      description,
      eventType[type],
      AgeGroup[ageGroup],
      startDate,
      endDate,
      location,
      price,
      verified,
      new Date(),
      ticketLink
    );

    await event.addEvent(fire);
    revalidatePath("/dashboard")
    revalidatePath("/events")
    revalidatePath(`/events/${event.id}`)
    return { message: 'success', eventId: event.id };
  } catch (error) {
    console.log(error);
    return { message: 'Error creating event', eventId: null };
  }
}

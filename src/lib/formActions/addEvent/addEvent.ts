'use server';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { convertFormData } from '@/lib/zod/convertFormData';
import { CreateEventSchema } from '@/lib/zod/event/createEventSchema';
import { GeoPoint } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import z from 'zod';

export default async function addEvent(prevState: any, formData: FormData) {
  const { currentUser, fire } = await getFirestoreFromServer();
  if (!currentUser) return { message: 'Unable to find current user', eventId: null };
  const res = convertFormData(CreateEventSchema, formData);

  if (!res.success) {
    return { status: 'Error', error: z.treeifyError(res.error).errors };
  }

  try {
    const org = await FlareOrg.getOrg(fire, currentUser.uid);
    const verified = org?.verified ?? false;
    const { data } = res;
    const fixedLocation = {
      ...data.location,
      coordinates: new GeoPoint(
        data.location.coordinates.latitude,
        data.location.coordinates.longitude
      ),
    };
    const event = new Event(
      currentUser.uid,
      data.title,
      data.description,
      data.type,
      data.age,
      data.start,
      data.end,
      fixedLocation,
      data.price,
      verified,
      new Date(),
      data.tickets
    );

    await event.addEvent(fire);
    revalidatePath('/dashboard');
    revalidatePath('/events');
    revalidatePath(`/events/${event.id}`);
    return { status: 'success', eventId: event.id };
  } catch (error) {
    console.log(error);
    return { status: 'Error creating event', eventId: null };
  }
}

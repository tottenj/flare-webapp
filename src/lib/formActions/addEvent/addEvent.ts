'use server';
import Event from '@/lib/classes/event/Event';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { zodFieldErrors } from '@/lib/utils/error/zodFeildErrors';
import { convertFormData } from '@/lib/zod/convertFormData';
import { CreateEventSchema } from '@/lib/zod/event/createEventSchema';
import { revalidatePath } from 'next/cache';

export default async function addEvent(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const { currentUser, fire } = await getFirestoreFromServer();
  const res = convertFormData(CreateEventSchema, formData);

  if (!currentUser)
    return { status: 'error', message: 'Unable to find current user', eventId: null };
  if (!res.success){
    return {
      status: 'error',
      message: 'Invalid Form Data',
      errors: zodFieldErrors(res.error),
      eventId: null,
    };
  }
  try {
    const org = await FlareOrg.getOrg(fire, currentUser.uid);
    if (!org) return { status: 'error', message: 'Authentication Error', eventId: null };
    const verified = org?.verified ?? false;
    const { data } = res;
    const event = new Event({
      flare_id: org.id,
      verified: verified,
      createdAt: new Date(),
      ...data,
    });

  

    await event.addEvent(fire);
    revalidatePath('/dashboard');
    revalidatePath('/events');
    revalidatePath(`/events/${event.id}`);
    return { status: 'success', message: 'Successfully Added Event', eventId: event.id };
  } catch (error) {
    console.log(error);
    return { status: 'error', message: 'Error Creating Event', eventId: null };
  }
}

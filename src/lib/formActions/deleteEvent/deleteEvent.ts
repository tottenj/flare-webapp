// deleteEvent.ts
'use server';

import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { ActionResponse } from '@/lib/types/ActionResponse';
import { revalidatePath } from 'next/cache';


export default async function deleteEvent(
  prevState: any,
  formData: FormData
): Promise<ActionResponse> {
  const id = formData.get('id')?.toString();
  if (!id) {
    return { status: 'error', message: 'Missing ID' };
  }

  const { fire } = await getFirestoreFromServer();

  try {
    await Event.deleteEvent(fire, id);

    revalidatePath('/dashboard');
    revalidatePath('/events');
    revalidatePath(`/events/${id}`);

    return { status: 'success', message: 'Deleted event successfully' };
  } catch (error: any) {
    console.error(error);
    return {
      status: 'error',
      message: 'Error deleting event',
    };
  }
}

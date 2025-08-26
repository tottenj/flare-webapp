'use server';

import Event from '@/lib/classes/event/Event';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';

export default async function deleteEvent(prevState: any, formData: FormData) {
  const id = formData.get('id')?.toString();
  if (!id) return { status: 'Error' };
  const { fire } = await getFirestoreFromServer();
  try {
    await Event.deleteEvent(fire, id);
    return { status: 'success' };
  } catch (error) {
    console.log(error)
    return { status: 'Error deleting event' };
  }
}

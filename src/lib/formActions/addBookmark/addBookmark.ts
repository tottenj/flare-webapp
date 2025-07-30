'use server';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import { getFirestoreFromServer } from '@/lib/firebase/auth/configs/getFirestoreFromServer';
import { revalidatePath } from 'next/cache';

export default async function addBookmark(prevState: any, formData: FormData) {
  const rawFormData = {
    eventId: formData.get('eventId')?.toString(),
    seenString: formData.get('seen')?.toString(),
  };

  const seen = rawFormData.seenString === 'true';
  if (!rawFormData.eventId) return { message: 'Error Saving Event Please Try Again Later' };

  const { fire, currentUser } = await getFirestoreFromServer();

  if (!currentUser) return { message: 'Not Signed In' };
  const idResult = await currentUser.getIdTokenResult();
  if (idResult.claims.organization) {
    const org = await FlareOrg.getOrg(fire, currentUser.uid);
    if (seen) {
      await org?.removeSavedEvent(fire, rawFormData.eventId);
      console.log("REMOVED")
      revalidatePath("/")
      revalidatePath("/events")
      return { message: 'success' };
    } else {
      await org?.addSavedEvent(fire, rawFormData.eventId);
      revalidatePath('/');
      revalidatePath('/events');
      return { message: 'success' };
    }
  } else {
    const user = await FlareUser.getUserById(currentUser.uid, fire);
    if (seen) {
      await user?.removeSavedEvent(fire, rawFormData.eventId);
      revalidatePath('/');
      revalidatePath('/events');
      return { message: 'success' };
    } else {
      await user?.addSavedEvent(fire, rawFormData.eventId);
      revalidatePath('/');
      revalidatePath('/events');
      return { message: 'success' };
    }
  }
}

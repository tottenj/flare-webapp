'use server';
import Collections from '@/lib/enums/collections';
import { getServicesFromServer } from '../auth/configs/getFirestoreFromServer';
import { getClaims } from '../utils/getClaims';
import { addFile } from './storageOperations';
import { revalidatePath } from 'next/cache';
import FlareUser from '@/lib/classes/flareUser/FlareUser';
import FlareOrg from '@/lib/classes/flareOrg/FlareOrg';

export default async function uploadProfilePicture(prevState: any, formData: FormData) {
  const { storage, currentUser, firestore } = await getServicesFromServer();
  const { claims } = await getClaims();
  let isUser = true;

  if (claims && claims.organization == true) {
    isUser = false;
  }

  const file = formData.get('file') as File;

  if (!file || !currentUser) return { message: 'No File or user' };

  try {
    const fileReferecne = await addFile(
      storage,
      `${isUser ? `${Collections.Users}` : `${Collections.Organizations}`}/${currentUser.uid}/profile`,
      file
    );
    if (isUser) {
      const flarUser = await FlareUser.getUserById(currentUser.uid, firestore);
      if (!flarUser) return { message: 'No user' };
      flarUser.updateUser(firestore, { profilePic: fileReferecne.ref.toString() });
    } else {
      const flarOrg = await FlareOrg.getOrg(firestore, currentUser.uid);
      if (!flarOrg) return { message: 'No Org' };
      flarOrg.updateOrg(firestore, { profilePic: fileReferecne.ref.toString() });
    }
    revalidatePath('/');
    revalidatePath('/dashboard');
    return { message: 'success' };
  } catch (error) {
    console.log(error);
    return { message: 'Error Changing Profile Picture' };
  }

  return { message: 'General Error' };
}

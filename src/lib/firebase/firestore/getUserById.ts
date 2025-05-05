import { doc, getDoc } from 'firebase/firestore';
import { db } from '../auth/clientApp';
import Collections from '@/lib/enums/collections';

export default async function getUserById(uid: string, dab = db) {
  const docRef = doc(dab, Collections.Users, uid);
  const document = await getDoc(docRef);

  if (document.exists()) {
    return document.data();
  } else {
    return null;
  }
}

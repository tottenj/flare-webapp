import { getAuthenticatedAppForUser } from './getAuthenticatedAppForUser';
import { initializeFirestore } from '../firebase/firestore';

export async function getFirestoreFromServer() {
  console.log('DID FIRESTORE SERVER');
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const fire = initializeFirestore();
  console.log('Mocked getFirestoreFromServer 🔥');
  return { firebaseServerApp, currentUser, fire };
}

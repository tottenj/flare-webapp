import 'server-only';

import { cookies, headers } from 'next/headers';
import { initializeServerApp, FirebaseServerAppSettings } from 'firebase/app';

import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../../../../firebaseconfig';


export async function getAuthenticatedAppForUser() {
  const headersObj = await headers();
  const token = (await cookies()).get('__session')?.value;

  let appSettings: FirebaseServerAppSettings = { authIdToken: token };
  appSettings.releaseOnDeref = headersObj;

  const firebaseServerApp = initializeServerApp(firebaseConfig, appSettings);

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}



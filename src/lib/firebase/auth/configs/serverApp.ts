import 'server-only';
import { cookies, headers } from 'next/headers';
import { initializeServerApp, FirebaseServerAppSettings } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import firebaseConfig from '../../../../../firebaseconfig';
import { connect } from 'http2';
import { cache } from 'react';


export const getAuthenticatedAppForUser = cache(async () => {
  const headersObj = await headers();
  const token = (await cookies()).get('__session')?.value;

  let appSettings: FirebaseServerAppSettings = { authIdToken: token };
  appSettings.releaseOnDeref = headersObj;

  const firebaseServerApp = initializeServerApp(firebaseConfig, appSettings);
  const auth = getAuth(firebaseServerApp);
  if(process.env.MODE === "test"){
   connectAuthEmulator(auth, `http://127.0.0.1:9099`, { disableWarnings: true });
  }
  await auth.authStateReady();
  return { firebaseServerApp, currentUser: auth.currentUser };
})



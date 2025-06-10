'use server';
import {
  connectFirestoreEmulator,
  FirestoreSettings,
  getFirestore,
  initializeFirestore,
} from 'firebase/firestore';
import { getAuthenticatedAppForUser } from './serverApp';
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { cache } from 'react';

const firestoreSettings: FirestoreSettings = {
  ignoreUndefinedProperties: true,
};

export const getFirestoreFromServer = cache(async () => {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const fire = initializeFirestore(firebaseServerApp, firestoreSettings);

  if (process.env.MODE === 'test') {
    console.log('Connecting firestore emulator');
    connectFirestoreEmulator(fire, '127.0.0.1', 8080);
  }
  return { firebaseServerApp, currentUser, fire };
});

export const getFirestoreFromStatic = cache(async () => {
  const fire = getFirestore();
  if (process.env.MODE === 'test') {
    connectFirestoreEmulator(fire, '127.0.0.1', 8080);
  }
  return fire
});

export const getStorageFromServer = cache(async () => {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
  if (process.env.MODE === 'test') {
    console.log('Connecting storage emulator');
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }

  return { storage, currentUser };
});

export const getServicesFromServer = cache(async () => {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const firestore = initializeFirestore(firebaseServerApp, firestoreSettings);
  const storage = getStorage(firebaseServerApp);
  if (process.env.MODE === 'test') {
    console.log('Connecting both emulators');
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }
  return { storage, firestore, currentUser };
});

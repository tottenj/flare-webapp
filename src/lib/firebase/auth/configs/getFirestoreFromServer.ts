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
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

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


export const getFunctionsFromServer = cache(async () => {
  const {firebaseServerApp} = await getAuthenticatedAppForUser()
  const functions = getFunctions(firebaseServerApp)
  if(process.env.MODE === 'test'){
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
  }
  return functions
})

export const getFirestoreFromStatic = cache(async () => {
  const fire = getFirestore();
  if (process.env.MODE === 'test') {
    connectFirestoreEmulator(fire, '127.0.0.1', 8080);
  }
  return fire;
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
  const { fire } = await getFirestoreFromServer();
  const { storage } = await getStorageFromServer();
  const { currentUser } = await getAuthenticatedAppForUser();

  if (process.env.MODE === 'test') {
    console.log('Connecting both emulators');
    connectFirestoreEmulator(fire, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }
  return { storage, firestore: fire, currentUser };
});

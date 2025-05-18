import 'server-only'
import { connectFirestoreEmulator, FirestoreSettings, getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const firestoreSettings:  FirestoreSettings = {
  ignoreUndefinedProperties: true,
};

const EMULATORS_ENABLED = process.env.NODE_ENV === 'development' || process.env.MODE === "test"; // Or check for a custom env var


export  default async function getFirestoreFromServer() {
  const serv = await getAuthenticatedAppForUser()

  if(EMULATORS_ENABLED){
    const fire = initializeFirestore(serv.firebaseServerApp, firestoreSettings);
    return connectFirestoreEmulator(fire, '127.0.0.1', 8080);
  }
  return initializeFirestore(serv.firebaseServerApp, firestoreSettings)
}

export async function getStorageFromServer() {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
  if(EMULATORS_ENABLED){
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }

  return { storage };
}


export async function getServicesFromServer(){
  const {firebaseServerApp} = await getAuthenticatedAppForUser()
  const firestore = initializeFirestore(firebaseServerApp, firestoreSettings)
  const storage = getStorage(firebaseServerApp)

  if(EMULATORS_ENABLED){
     connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
     connectStorageEmulator(storage, '127.0.0.1', 9199);
  }
  return{storage, firestore}
}



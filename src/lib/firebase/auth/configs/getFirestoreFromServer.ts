import 'server-only'
import { connectFirestoreEmulator, FirestoreSettings, getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator } from 'firebase/auth';

const firestoreSettings:  FirestoreSettings = {
  ignoreUndefinedProperties: true,
};



export  default async function getFirestoreFromServer() {
  const serv = await getAuthenticatedAppForUser()
  const fire = initializeFirestore(serv.firebaseServerApp, firestoreSettings);
  return fire
}

export async function getStorageFromServer() {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
 

  return { storage };
}


export async function getServicesFromServer(){
  const {firebaseServerApp} = await getAuthenticatedAppForUser()
  const firestore = initializeFirestore(firebaseServerApp, firestoreSettings)
  const storage = getStorage(firebaseServerApp)
  return{storage, firestore}
}



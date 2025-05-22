import 'server-only'
import { connectFirestoreEmulator, FirestoreSettings, getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";
import { connectStorageEmulator, getStorage } from 'firebase/storage';
import { connectAuthEmulator } from 'firebase/auth';

const firestoreSettings:  FirestoreSettings = {
  ignoreUndefinedProperties: true,
};


export  default async function getFirestoreFromServer() {
  const {firebaseServerApp, currentUser} = await getAuthenticatedAppForUser()
  const fire = initializeFirestore(firebaseServerApp, firestoreSettings);
  return {firebaseServerApp, currentUser, fire}
}

export async function getStorageFromServer() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
  return { storage, currentUser };
}


export async function getServicesFromServer(){
  const {firebaseServerApp, currentUser} = await getAuthenticatedAppForUser()
  const firestore = initializeFirestore(firebaseServerApp, firestoreSettings)
  const storage = getStorage(firebaseServerApp)
  return{storage, firestore, currentUser}
}



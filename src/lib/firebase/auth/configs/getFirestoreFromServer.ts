import 'server-only'
import { FirestoreSettings, getFirestore, initializeFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";
import { getStorage } from 'firebase/storage';

const firestoreSettings:  FirestoreSettings = {
  ignoreUndefinedProperties: true,
};

export  default async function getFirestoreFromServer() {
  const serv = await getAuthenticatedAppForUser()
  return initializeFirestore(serv.firebaseServerApp, firestoreSettings)
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



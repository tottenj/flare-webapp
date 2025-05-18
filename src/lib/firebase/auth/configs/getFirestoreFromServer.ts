import 'server-only'
import { getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";
import { getStorage } from 'firebase/storage';

export  default async function getFirestoreFromServer() {
  const serv = await getAuthenticatedAppForUser()
  return getFirestore(serv.firebaseServerApp)
}

export async function getStorageFromServer() {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
  return { storage };
}


export async function getServicesFromServer(){
  const {firebaseServerApp} = await getAuthenticatedAppForUser()
  const firestore = getFirestore(firebaseServerApp)
  const storage = getStorage(firebaseServerApp)
  return{storage, firestore}
}



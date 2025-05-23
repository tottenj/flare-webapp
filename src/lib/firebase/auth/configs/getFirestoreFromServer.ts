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
  if(process.env.MODE === "test"){
    console.log("Connecting firestore emulator")
    connectFirestoreEmulator(fire, '127.0.0.1', 8080);
  }
  return {firebaseServerApp, currentUser, fire}
}

export async function getStorageFromServer() {
  const { firebaseServerApp, currentUser } = await getAuthenticatedAppForUser();
  const storage = getStorage(firebaseServerApp);
  if (process.env.MODE === 'test') {
    console.log("Connecting storage emulator")
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  }


  return { storage, currentUser };
}


export async function getServicesFromServer(){
  const {firebaseServerApp, currentUser} = await getAuthenticatedAppForUser()
  const firestore = initializeFirestore(firebaseServerApp, firestoreSettings)
  const storage = getStorage(firebaseServerApp)
  if (process.env.MODE === 'test') {
    console.log("Connecting both emulators")
    connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
    connectStorageEmulator(storage, '127.0.0.1', 9199);
  }
  return{storage, firestore, currentUser}
}



import { getFirestore } from "firebase/firestore";
import { getAuthenticatedAppForUser } from "./serverApp";

export  default async function getFirestoreFromServer() {
  const serv = await getAuthenticatedAppForUser()
  return getFirestore(serv.firebaseServerApp)
}
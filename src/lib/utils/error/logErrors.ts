import errorLocation from "@/lib/enums/errorLocations"
import getFirestoreFromServer from "@/lib/firebase/auth/configs/getFirestoreFromServer"
import { addDocument } from "@/lib/firebase/firestore/firestoreOperations"

interface logErrorProps{
    errors: Error
    errorLocation: errorLocation
}

export default async function logErrors({errors}:logErrorProps) {
  const firestore  = await getFirestoreFromServer()
  const data =  {
    name: errors.name,
    message: errors.message,
    date: new Date()
  }
 
  console.log(errors.message)
  addDocument(firestore, `Errors/${data.date.getMilliseconds()}`, data)
}
import { doc, Firestore, FirestoreDataConverter, getDoc, DocumentData, DocumentSnapshot, setDoc, WithFieldValue } from 'firebase/firestore';
import 'server-only';


export async function getDocument<AppModelType, DbModelType extends DocumentData>(
  firestore: Firestore,
  path: string,
  converter: FirestoreDataConverter<AppModelType, DbModelType>
): Promise<DocumentSnapshot<AppModelType, DbModelType>> {
  const ref = doc(firestore, path).withConverter(converter);
  const snapshot = await getDoc(ref);
  return snapshot;
}

export async function addDocument<AppModelType, DbModelType extends DocumentData = DocumentData>(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<AppModelType>, 
  converter: FirestoreDataConverter<AppModelType, DbModelType> 
): Promise<void>;

export async function addDocument(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<DocumentData> 

): Promise<void>;

export async function addDocument<AppModelType, DbModelType extends DocumentData = DocumentData>(
  firestore: Firestore,
  path: string,
  data: WithFieldValue<any>, 
  converter?: FirestoreDataConverter<AppModelType, DbModelType> 
): Promise<void> {
  if (converter) {
    const ref = doc(firestore, path).withConverter(converter);
    await setDoc(ref, data); 
  } else {
    const ref = doc(firestore, path); 
    await setDoc(ref, data); 
  }
}


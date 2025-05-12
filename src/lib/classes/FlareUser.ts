import { User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  DocumentReference,
  Firestore,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
} from 'firebase/firestore';
import Collections from '../enums/collections';
import { db } from '../firebase/auth/configs/clientApp';

export default class FlareUser {
  id: string;
  email: string;

  constructor(user: User);
  constructor(id: string, email: string);
  constructor(id: string | User, email?: string) {
    if ((id as User).uid) {
      const user = id as User;
      this.id = user.uid;
      this.email = user.email || '';
    } else {
      this.id = id as string;
      this.email = email || '';
    }
  }

  static async getUserById(id: string, dab: Firestore = db): Promise<FlareUser | null> {
    try {
      const docuRef = doc(dab, Collections.Users, id).withConverter(userConverter);
      const document = await getDoc(docuRef);
      if (document.exists()) {
        return document.data();
      }
    } catch (error) {
      console.log(error);
      return null
    }
    return null;
  }

  async addUser(dab:Firestore = db): Promise<boolean> {
    try {
      if (!this.id) {
        return false;
      }
      const docuRef = doc(dab, Collections.Users, this.id)
      await setDoc(docuRef, this);
    } catch (error) {
      console.log(error);
      return false;
    }
    return true;
  }
}

const userConverter = {
  toFirestore(user: FlareUser): DocumentData {
    return { id: user.id, email: user.email };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FlareUser {
    const data = snapshot.data(options);
    return new FlareUser(data.id, data.email);
  },
};

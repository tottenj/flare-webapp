import { User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  DocumentReference,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
} from 'firebase/firestore';
import { db } from '../firebase/auth/clientApp';
import Collections from '../enums/collections';
import { SnapshotMatchOptions } from 'vitest';

export default class FlareUser {
  id: string;
  email: string;
  docRef: DocumentReference;

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
    this.docRef = doc(db, Collections.Users, this.id).withConverter(userConverter);
  }

  static async getUserById(id: string): Promise<FlareUser | null> {
    try {
      const docuRef = doc(db, Collections.Users, id).withConverter(userConverter);
      const document = await getDoc(docuRef);
      if (document.exists()) {
        return document.data();
      }
    } catch (error) {
      console.log(error);
    }
    return null;
  }

  async addUser(): Promise<boolean> {
    try {
      if(!this.id){
        return false
      }
      await setDoc(this.docRef, this);
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

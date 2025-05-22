import { User } from 'firebase/auth';
import {
  doc,
  DocumentData,
  Firestore,
  getDoc,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
} from 'firebase/firestore';
import Collections from '../../enums/collections';
import { addDocument, getDocument } from '@/lib/firebase/firestore/firestoreOperations';
import { isUser } from '@/lib/utils/other/isUser';
import { db } from '@/lib/firebase/auth/configs/clientApp';

export default class FlareUser {
  id: string;
  name?: string | null;
  email: string | null;
  profilePic?: string | null;

  // Overloads
  constructor(user: User);
  constructor(id: string, email: string, name?: string, profilePic?: string);

  // Implementation
  constructor(idOrUser: string | User, email?: string, name?: string, profilePic?: string) {
    if (isUser(idOrUser)) {
      const user = idOrUser;
      this.id = user.uid;
      this.email = user.email;
      this.name = user.displayName;
      this.profilePic = user.photoURL;
    } else {
      this.id = idOrUser;
      this.email = email || null;
      this.name = name ?? null;
      this.profilePic = profilePic ?? null;
    }
  }

  static emptyUser = new FlareUser('123', 'example@gmail.com');

  static async getUserById(id: string, dab: Firestore = db): Promise<FlareUser | null> {
    const userDoc = await getDocument(dab, `${Collections.Users}/${id}`, userConverter)
    if(userDoc.exists()){
      return userDoc.data()
    }else{
      return null
    }
  }

  async addUser(dab: Firestore = db): Promise<boolean> {
    if(!this.id) return false
    await addDocument(dab, `${Collections.Users}/${this.id}`,this, userConverter)
    return true
  }
}


// Firestore data converter
export const userConverter = {
  toFirestore(user: FlareUser): DocumentData {
    return {
      id: user.id,
      email: user.email,
      name: user.name ?? null,
      profilePic: user.profilePic ?? null,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FlareUser {
    const data = snapshot.data(options);
    return new FlareUser(data.id, data.email, data.name, data.profilePic);
  },
};

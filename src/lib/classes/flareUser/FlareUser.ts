import { updateCurrentUser, User } from 'firebase/auth';
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
import { addDocument, deleteDocument, getAllDocuments, getDocument, updateDocument } from '@/lib/firebase/firestore/firestoreOperations';
import { isUser } from '@/lib/utils/other/isUser';
import { db } from '@/lib/firebase/auth/configs/clientApp';
import { FirebaseStorage } from 'firebase/storage';
import { getFile } from '@/lib/firebase/storage/storageOperations';
import Event from '../event/Event';

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
    const userDoc = await getDocument(dab, `${Collections.Users}/${id}`, userConverter);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      return null;
    }
  }

  async getProfilePic(firestoredb: Firestore, storage: FirebaseStorage) {
    const pic = await getDocument(
      firestoredb,
      `${Collections.Organizations}/${this.id}`,
      userConverter
    );
    if (pic.exists() && pic.data().profilePic) {
      const ref = pic.data().profilePic;
      if (ref) {
        return await getFile(storage, ref);
      }
    }
  }

  async updateUser(dab: Firestore, data: Partial<FlareUser>) {
    if (!this.id) return false;
    await updateDocument(dab, `${Collections.Users}/${this.id}`, data, userConverter, ['id']);
  }

  async addUser(dab: Firestore = db): Promise<boolean> {
    if (!this.id) return false;
    await addDocument(dab, `${Collections.Users}/${this.id}`, this, userConverter);
    return true;
  }

  async hasSavedEvent(firestoredb: Firestore, eventId: string) {
    const doc = await getDocument(
      firestoredb,
      `${Collections.Users}/${this.id}/${Collections.Saved}/${eventId}`
    );

    if (doc.exists()) return true;
    return false;
  }

  async addSavedEvent(firestoreDb: Firestore, eventId: string) {
    await addDocument(
      firestoreDb,
      `${Collections.Users}/${this.id}/${Collections.Saved}/${eventId}`,
      { id: eventId }
    );
  }

  async getAllSavedEvents(firestoreDb: Firestore){
    const docs = await getAllDocuments(firestoreDb, `${Collections.Users}/${this.id}/${Collections.Saved}`)
    const ids = docs.map((doc) => doc.id)
    const events = await Promise.all(ids.map((id) => Event.getEvent(firestoreDb, id)));
    const existingEvents = events.filter((event): event is NonNullable<typeof event> =>Boolean(event));
    return existingEvents
  }

  async removeSavedEvent(firestoreDb: Firestore, eventId: string) {
    await deleteDocument(
      firestoreDb,
      `${Collections.Users}/${this.id}/${Collections.Saved}/${eventId}`
    );
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

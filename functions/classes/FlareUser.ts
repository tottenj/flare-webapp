import { User } from 'firebase/auth';
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';


import { isUser } from './isUser';


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

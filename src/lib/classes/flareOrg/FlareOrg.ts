import { User } from 'firebase/auth';
import {
  DocumentData,
  Firestore,
  GeoPoint,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
} from 'firebase/firestore';
import flareLocation from '@/lib/types/Location';
import {
  addDocument,
  deleteDocument,
  getAllDocuments,
  getDocument,
  updateDocument,
  WhereClause,
} from '@/lib/firebase/firestore/firestoreOperations';
import Collections from '@/lib/enums/collections';
import { FirebaseStorage } from 'firebase/storage';
import { addFile, getFile } from '@/lib/firebase/storage/storageOperations';
import Event from '../event/Event';
import { Geohash, geohashForLocation } from 'geofire-common';

export default class FlareOrg {
  id: string;
  name: string;
  email: string | null;
  profilePic?: string | null;
  description?: string;
  location?: flareLocation;
  verified?: boolean;

  constructor(user: User, name: string, location?: flareLocation);
  constructor(
    id: string,
    name: string,
    email: string,
    profilePic?: string,
    description?: string,
    location?: flareLocation,
    verified?: boolean
  );

  constructor(
    idOrUser: string | User,
    name: string, // Renamed for clarity in the User case
    emailOrLocation?: string | flareLocation, // Can be email (string) or location (flareLocation)
    profilePicOrLocation?: string | flareLocation, // Can be profilePic (string) or location (flareLocation)
    description?: string,
    location?: flareLocation,
    verified: boolean = false
  ) {
    if (isUser(idOrUser)) {
      this.id = idOrUser.uid;
      this.email = idOrUser.email;
      this.profilePic = idOrUser.photoURL;
      this.description = description;
      this.name = name;
      this.location = emailOrLocation as flareLocation | undefined;
      this.verified = verified;
    } else {
      this.id = idOrUser;
      this.name = name;
      this.email = emailOrLocation as string;
      this.profilePic = profilePicOrLocation as string | undefined;
      this.description = description;
      this.location = location;
      this.verified = verified;
    }
  }

  get hash(): Geohash | null {
    if (this.location) {
      return geohashForLocation([
        this.location.coordinates.latitude,
        this.location.coordinates.longitude,
      ]);
    } else {
      return null;
    }
  }

  static sampleOrg = new FlareOrg(
    'abc',
    'name',
    'email',
    '',
    '',
    { id: '', coordinates: new GeoPoint(0, 0) },
    true
  );

  static async getOrg(firestoredb: Firestore, id: string) {
    const org = await getDocument(firestoredb, `${Collections.Organizations}/${id}`, orgConverter);
    if (!org.exists()) return null;
    return org.data();
  }

  async getProfilePicture(firestoredb: Firestore, storage: FirebaseStorage) {
    const pic = await getDocument(
      firestoredb,
      `${Collections.Organizations}/${this.id}`,
      orgConverter
    );
    if (pic.exists() && pic.data().profilePic) {
      const ref = pic.data().profilePic;
      if (ref) {
        return await getFile(storage, ref);
      }
    }
  }

  async updateOrg(firestore: Firestore, data: Partial<FlareOrg>) {
    if (!this.id) return false;
    await updateDocument(firestore, `${Collections.Organizations}/${this.id}`, data, orgConverter, [
      'id',
      'verified',
    ]);
  }

  async addOrg(firestoredb: Firestore) {
    await addDocument(firestoredb, `${Collections.Organizations}/${this.id}`, this, orgConverter);
  }

  async hasSavedEvent(firestoredb: Firestore, eventId: string) {
    const doc = await getDocument(
      firestoredb,
      `${Collections.Organizations}/${this.id}/${Collections.Saved}/${eventId}`
    );

    if (doc.exists()) return true;
    return false;
  }

  async addSavedEvent(firestoreDb: Firestore, eventId: string) {
    await addDocument(
      firestoreDb,
      `${Collections.Organizations}/${this.id}/${Collections.Saved}/${eventId}`,
      { id: eventId }
    );
  }

  async removeSavedEvent(firestoreDb: Firestore, eventId: string) {
    await deleteDocument(
      firestoreDb,
      `${Collections.Organizations}/${this.id}/${Collections.Saved}/${eventId}`
    );
  }

  async getAllSavedEvents(firestoreDb: Firestore) {
    const docs = await getAllDocuments(
      firestoreDb,
      `${Collections.Organizations}/${this.id}/${Collections.Saved}`
    );
    const ids = docs.map((doc) => doc.id);
    const events = await Promise.allSettled(ids.map((id) => Event.getEvent(firestoreDb, id)));

    const existingAndPermittedEvents: Event[] = [];

    events.forEach((result) => {
      if (result.status == 'fulfilled') {
        const event = result.value;
        if (event !== null) {
          existingAndPermittedEvents.push(event);
        }
      }
    });

    return existingAndPermittedEvents;
  }


  toPlain(): PlainOrg {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      profilePic: this.profilePic,
      description: this.description,
      locationName: this.location?.name,
      locationId: this.location?.id,
      verified: this.verified
    }
  }

}


export type PlainOrg = {
  id: string
  name: string
  email: string | null
  profilePic?: string | null
  description?: string
  locationName?: string | null
  locationId?: string
  verified?: boolean
}

export const orgConverter = {
  toFirestore(user: FlareOrg): DocumentData {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      location: user.location,
      profilePic: user.profilePic,
      description: user.description,
      verified: user.verified,
      hash: user.hash
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FlareOrg {
    const data = snapshot.data(options);
    return new FlareOrg(
      data.id,
      data.name,
      data.email,
      data.profilePic,
      data.description,
      data.location,
      data.verified
    );
  },
};

function isUser(obj: any): obj is User {
  return typeof obj === 'object' && obj !== null && 'uid' in obj;
}

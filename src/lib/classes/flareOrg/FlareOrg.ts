import { User } from 'firebase/auth';
import { DocumentData, Firestore, GeoPoint, getFirestore, QueryDocumentSnapshot, SnapshotOptions } from 'firebase/firestore';
import flareLocation from '@/lib/types/Location';
import { addDocument, getDocument, updateDocument } from '@/lib/firebase/firestore/firestoreOperations';
import Collections from '@/lib/enums/collections';
import { FirebaseStorage } from 'firebase/storage';
import { addFile, getFile } from '@/lib/firebase/storage/storageOperations';

export default class FlareOrg {
  id: string;
  name: string;
  email: string | null;
  profilePic?: string | null;
  description?: string;
  location?: flareLocation;
  verified?: boolean



  // Simplify overloads to focus on how you initialize the Org *data*,
  // and always require the firestoreDb instance.
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

  // The implementation signature matches the first overload, but we handle both cases inside
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
      this.description = description
      this.name = name; // Use the 'name' parameter here
      // The third parameter in the overload (emailOrLocation) is the location for the User case
      this.location = emailOrLocation as flareLocation | undefined;
      this.verified = verified

      // We no longer need 'this.app' or call getFirestore here
    } else {
      // This case assumes idOrUser is a string (the ID).
      // Parameters are: id (string), name (string), email (string), profilePic (string), location (flareLocation)
      this.id = idOrUser;
      this.name = name;
      this.email = emailOrLocation as string;
      this.profilePic = profilePicOrLocation as string | undefined;
      this.description = description
      this.location = location;
      this.verified = verified
    }
  }

  static sampleOrg = new FlareOrg("abc", "name", "email", "", "",{id: "", coordinates: new GeoPoint(0,0)} , true)

  static async getOrg(firestoredb: Firestore, id:string){
    const org = await getDocument(firestoredb, `${Collections.Organizations}/${id}`, orgConverter)
    if(!org.exists()) return null
    return org.data()
  }

  async getProfilePicture(firestoredb: Firestore, storage: FirebaseStorage){
    const pic = await getDocument(firestoredb, `${Collections.Organizations}/${this.id}`, orgConverter)
    if(pic.exists() && pic.data().profilePic){
      const ref = pic.data().profilePic
      if(ref){
        return await getFile(storage, ref)
      }
    }
  }

  async updateOrg(firestore: Firestore, data: Partial<FlareOrg>){
    if(!this.id) return false
    await updateDocument(firestore, `${Collections.Organizations}/${this.id}`, data, orgConverter, ['id','verified'])
  }



  async addOrg(firestoredb: Firestore) {
    await addDocument(firestoredb, `${Collections.Organizations}/${this.id}`, this, orgConverter)
  }

}



export const orgConverter = {
  toFirestore(user: FlareOrg): DocumentData {
    return { id: user.id, email: user.email, name: user.name, location: user.location, profilePic: user.profilePic, description: user.description, verified: user.verified };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): FlareOrg {
    const data = snapshot.data(options);
    return new FlareOrg(data.id, data.name, data.email, data.profilePic, data.description, data.location, data.verified)
  },
};




function isUser(obj: any): obj is User {
  return typeof obj === 'object' && obj !== null && 'uid' in obj;
}

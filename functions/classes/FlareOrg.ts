import { User } from "firebase/auth";
import flareLocation from "./flareLocation";
import { DocumentData, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { Geohash, geohashForLocation } from "geofire-common";

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
      hash: user.hash,
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

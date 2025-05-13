import { User } from 'firebase/auth';

export default class FlareOrg {
  id: string;
  name: string;
  email: string | null;
  profilePic?: string | null;
  description?: string;
  location?: Location;

  // Correct overloads
  constructor(user: User, name: string, location?: Location);
  constructor(id: string, name: string, email: string, profilePic?: string, location?: Location);

  constructor(
    idOrUser: string | User,
    nameOrEmail: string,
    emailOrLocation?: string | Location,
    profilePic?: string,
    location?: Location
  ) {
    if (isUser(idOrUser)) {
      this.id = idOrUser.uid;
      this.email = idOrUser.email;
      this.profilePic = idOrUser.photoURL;
      this.name = nameOrEmail;
      this.location = emailOrLocation as Location;
    } else {
      this.id = idOrUser;
      this.name = nameOrEmail;
      this.email = emailOrLocation as string;
      this.profilePic = profilePic;
      this.location = location;
    }
  }
}

function isUser(obj: any): obj is User {
  return typeof obj === 'object' && obj !== null && 'uid' in obj;
}

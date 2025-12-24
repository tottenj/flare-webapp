export interface UserProps {
  firebaseUid: string;
  email: string;
  emailVerified: boolean;
  status: 'PENDING' | 'ACTIVE';
  role: 'USER';
  createdAt: Date;
}

export class UserDomain {
  constructor(public readonly props: UserProps) {}

  static onSignUp(input: { firebaseUid: string; email: string; emailVerified: boolean }) {    
    return new UserDomain({
      firebaseUid: input.firebaseUid,
      email: input.email,
      emailVerified: false,
      status: 'PENDING',
      role: 'USER',
      createdAt: new Date(),
    });
  }
  
}

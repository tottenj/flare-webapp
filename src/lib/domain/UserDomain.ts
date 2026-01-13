export interface UserProps {
  firebaseUid: string;
  email: string;
  status: 'PENDING' | 'ACTIVE';
  role: 'USER';
  createdAt: Date;
}

export class UserDomain {
  constructor(public readonly props: UserProps) {}

  static onSignUp(input: { firebaseUid: string; email: string; }) {
    return new UserDomain({
      firebaseUid: input.firebaseUid,
      email: input.email,
      status: 'PENDING',
      role: 'USER',
      createdAt: new Date(),
    });
  }
}

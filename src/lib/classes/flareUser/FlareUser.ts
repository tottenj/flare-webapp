import { FlareUser as FlareUserModel } from '@/app/generated/prisma';
import User from '../user/User';
import { User as UserModel } from '@/app/generated/prisma';

export default class FlareUser {
  private id: string;
  uid: string;
  user: User;

  constructor(data: FlareUserModel & { user: UserModel }) {
    this.id = data.id;
    this.uid = data.user_id
    this.user = new User(data.user);
  }

  toJSON() {
    return {
      id: this.id,
      uid: this.uid,
      user: this.user.toJSON(),
    };
  }
}

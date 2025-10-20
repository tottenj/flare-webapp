import UserDal from '../dals/userDal';
import requireAuth from '@/lib/firebase/auth/requireAuth';
import BaseService from './baseService';
import FlareUserService from './flareUserService';
import { CreateDbUserSchema, CreateUserDto } from '../dtos/UserDto';
import { Prisma } from '@/app/generated/prisma';
type UserKeys = keyof Prisma.UserGetPayload<{}>; 


export default class userService extends BaseService<UserDal, UserKeys> {
  constructor() {
    super(UserDal);
  }

  protected publicFields: Partial<Record<UserKeys, boolean>> = {
    account_type: true,
  };

  

  async createUser(incoming: CreateUserDto) {
    const parse = CreateDbUserSchema.safeParse(incoming)
    if(!parse.success) throw new Error("Invalid Data")
    const {data} = parse
    const {uid} = await requireAuth();
    const result = await this.dal.createUser({ id: uid, ...data });
    const { account_type, id } = result;
    if (account_type === 'user') {
      const flareUserService = new FlareUserService();
      flareUserService.createFlareUser(id);
    } else if (account_type === 'org') {
    }
  }

  async deleteUser(){
    const {uid} = await requireAuth()
    await this.dal.delete(uid)
  }

  
}

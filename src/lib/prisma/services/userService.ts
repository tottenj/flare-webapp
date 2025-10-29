import UserDal from '../dals/userDal/userDal';
import BaseService from './BaseService/baseService';
import FlareUserService from './FlareUserService/flareUserService';
import { CreateDbUserSchema, CreateUserDto } from '../dtos/UserDto';
import { Prisma } from '@/app/generated/prisma';

import FlareOrgService from './FlareOrgService/flareOrgService';
import prisma from '../prisma';
import { createOrgDtoType } from '../dtos/FlareOrgDto';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
type UserKeys = keyof Prisma.UserGetPayload<{}>;

export default class userService extends BaseService<UserDal, UserKeys> {
  constructor() {
    super(UserDal);
  }

  protected publicFields: Partial<Record<UserKeys, boolean>> = {
    account_type: true,
  };

  async createUser(incoming: CreateUserDto, org?: createOrgDtoType) {
    const parse = CreateDbUserSchema.safeParse(incoming);
    if (!parse.success) throw new Error('Invalid Data');
    const { data } = parse;
    const { uid } = await requireAuth();

    try {
      await prisma.$transaction(async (tx) => {
        const result = await this.dal.createUser({ id: uid, ...data }, tx);
        const { account_type, id } = result;
        if (account_type === 'user') {
          const flareUserService = new FlareUserService();
          await flareUserService.createFlareUser(id, tx, { uid });
        } else if (account_type === 'org' && org) {
          const flareOrgService = new FlareOrgService();
          await flareOrgService.createOrg(org, tx);
        } else {
          throw new Error('No Account Type Recived');
        }
      });
    } catch (error) {
      console.log(error);
      throw new Error('Error while creating user');
    }
  }

  async deleteUser() {
    const { uid } = await requireAuth();
    await this.dal.delete(uid);
  }
}

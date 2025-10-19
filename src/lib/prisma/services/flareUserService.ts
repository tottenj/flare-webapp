import requireAuth from '@/lib/firebase/auth/requireAuth';
import flareUserDal from '../dals/flareUserDal';
import BaseService from './baseService';
import { Prisma } from '@/app/generated/prisma';
import isUsersAccount from '@/lib/firebase/auth/isUsersAccount';

type keys = keyof Prisma.FlareUserGetPayload<{}>;
export default class FlareUserService extends BaseService<flareUserDal, keys> {
  constructor() {
    super(flareUserDal);
  }
  publicFields: Partial<Record<'id' | 'user_id', boolean>> = {};

  async createFlareUser(id: string) {
    const { uid } = await requireAuth();
    if (!isUsersAccount(id, uid)) throw new Error('Cannot create account');
    await this.dal.createFlareUser(id);
  }
}

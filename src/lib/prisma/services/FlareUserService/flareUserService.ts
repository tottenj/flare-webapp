
import flareUserDal from '../../dals/flareUserDal';
import BaseService from '../BaseService/baseService';
import { Prisma } from '@/app/generated/prisma';
import isUsersAccount from '@/lib/firebase/auth/utils/isUsersAccount/isUsersAccount';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import { FlareContext } from '@/lib/types/FlareClaims';

type keys = keyof Prisma.FlareUserGetPayload<{}>;
export default class FlareUserService extends BaseService<flareUserDal, keys> {
  constructor() {
    super(flareUserDal);
  }
  publicFields: Partial<Record<'id' | 'user_id', boolean>> = {};

  async createFlareUser(id: string, tx?: Prisma.TransactionClient, context?: FlareContext) {
    const uid = context?.uid ?? (await requireAuth()).uid;
    if (!isUsersAccount(id, uid)) throw new Error('Cannot create account');
    const data: Prisma.FlareUserCreateInput = {
      user: {
        connect: {
          id: uid,
        },
      },
    };
    await this.dal.createFlareUser(data, tx);
  }
}

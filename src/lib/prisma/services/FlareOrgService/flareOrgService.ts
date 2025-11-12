import { Prisma } from '@/app/generated/prisma';
import flareOrgDal from '../../dals/flareOrgDal';
import BaseService from '../BaseService/baseService';

import LocationService from '../locationService/locationService';
import { FlareContext } from '@/lib/types/FlareClaims';
import { createOrgDBSchema, createOrgDtoType } from '../../dtos/FlareOrgDto';
import requireAuth from '@/lib/firebase/auth/utils/requireAuth';

type keys = keyof Prisma.FlareOrgGetPayload<{}>;
export default class FlareOrgService extends BaseService<flareOrgDal, keys> {
  constructor() {
    super(flareOrgDal);
  }

  protected publicFields: Partial<Record<keys, boolean>> = {
    description: true,
  };

  async create(org: createOrgDtoType, tx?: Prisma.TransactionClient, context?: FlareContext) {
    const sanitized = createOrgDBSchema.safeParse(org);
    if (!sanitized.success) throw new Error('Invalid Organization');
    const uid = context?.uid ?? (await requireAuth()).uid;
    const { location, socials, description } = sanitized.data;
    const locationService = new LocationService();
    const locId = await locationService.create(location, tx);
    if (!locId) throw new Error('Unable to create location at this time');
    const flareOrg: Prisma.FlareOrgCreateInput = {
      user: {
        connect: {
          id: uid,
        },
      },
      location: {
        connect: {
          id: locId,
        },
      },
      description: description,
      socials: {
        create: {
          ...socials,
        },
      },
    };
    await this.dal.create(flareOrg, tx);
  }
}

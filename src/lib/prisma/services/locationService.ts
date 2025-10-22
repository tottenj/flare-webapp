import { Prisma } from '@/app/generated/prisma';
import locationDal from '../dals/locationDal';
import BaseService from './baseService';
import { createLocation, createLocationSchema } from '../dtos/LocationDto';

type keys = keyof Prisma.LocationGetPayload<{}>;
export default class LocationService extends BaseService<locationDal, keys> {
  constructor() {
    super(locationDal);
  }

  protected publicFields: Partial<Record<'name' | 'id' | 'place_id', boolean>> = {
    name: true,
    place_id: true,
    id: true,
  };

  async create(loc: createLocation, tx?: Prisma.TransactionClient) {
    const sanitized = createLocationSchema.safeParse(loc);
    if (!sanitized.success) throw new Error('Invalid Location');
    const { data } = sanitized;
    if (!Number.isFinite(data.coordinates.lat) || !Number.isFinite(data.coordinates.lng)) throw new Error('Invalid coordinates');

    return await this.dal.create(data, tx);
  }
}

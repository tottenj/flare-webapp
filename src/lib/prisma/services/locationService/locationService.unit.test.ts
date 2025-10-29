import { Prisma } from '@prisma/client';
import locationDal from '../../dals/locationDal';
import { createLocation } from '../../dtos/LocationDto';
import LocationService from './locationService';
import { expect } from '@jest/globals';

jest.mock('@/lib/prisma/dals/locationDal');

describe('location service', () => {
  let service: LocationService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    (locationDal as unknown as jest.Mock).mockImplementation(() => ({
      create: mockCreate,
    }));

    service = new LocationService();
  });

  it('calls dal.create with valid data', async () => {
    const mockLocation: createLocation = {
      name: 'Test Park',
      place_id: 'abc123',
      coordinates: { lat: 43.7, lng: -79.4 },
    };

    const mockResult = { id: '1', ...mockLocation };
    mockCreate.mockResolvedValue(mockResult);

    const result = await service.create(mockLocation);

    expect(mockCreate).toHaveBeenCalledWith(mockLocation, undefined);
    expect(result).toEqual(mockResult);
  });


  it('throws error if validation fails', async () => {
    const invalidLocation = {
      name: '',
      place_id: '',
      coordinates: { lat: 'bad', lng: 'data' },
    } as any;

    await expect(service.create(invalidLocation)).rejects.toThrow('Invalid Location');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('throws error if coordinates are not finite numbers', async () => {
    const invalidCoords: createLocation = {
      name: 'Bad Coords',
      place_id: 'xyz',
      coordinates: { lat: NaN, lng: 100 },
    };

    await expect(service.create(invalidCoords)).rejects.toThrow('Invalid Location');
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it('uses provided transaction client if given', async () => {
    const tx = {} as Prisma.TransactionClient;
    const mockLocation: createLocation = {
      name: 'With TX',
      place_id: 'tx123',
      coordinates: { lat: 40, lng: -70 },
    };

    await service.create(mockLocation, tx);

    expect(mockCreate).toHaveBeenCalledWith(mockLocation, tx);
  });
});

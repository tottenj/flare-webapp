import requireAuth from '@/lib/firebase/auth/utils/requireAuth';
import LocationService from '@/lib/prisma/services/locationService/locationService';
import FlareOrgService from './flareOrgService';
import { expect } from '@jest/globals';

jest.mock('@/lib/firebase/auth/utils/requireAuth');
jest.mock('@/lib/prisma/dals/flareOrgDal/flareOrgDal');
jest.mock('@/lib/prisma/services/locationService/locationService');

describe('create', () => {
  let service: FlareOrgService;
  let mockCreateLocation: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    (requireAuth as jest.Mock).mockImplementation(() => ({ uid: 'abc123' }));
    service = new FlareOrgService();
    (service['dal'].create as jest.Mock).mockImplementation(async () => {});
    mockCreateLocation = jest.fn();
    (LocationService as jest.Mock).mockImplementation(() => ({
      create: mockCreateLocation,
    }));
  });

  describe('success', () => {
    it('successfully creates org without tx and context', async () => {
      const fakeOrg = {
        location: { place_id: 'placeId', coordinates: { lat: 1, lng: 3 }, name: 'placeName' },
      };
      mockCreateLocation.mockResolvedValueOnce(4);

      await service.create(fakeOrg);
      expect(requireAuth).toHaveBeenCalled();
      expect(service['dal'].create).toHaveBeenCalled();
      expect(mockCreateLocation.mock.calls[0][0]).toEqual(fakeOrg.location);
    });

    it('uses tx when passed in', async () => {
      const fakeOrg = {
        location: { place_id: 'placeId', coordinates: { lat: 1, lng: 3 }, name: 'placeName' },
      };

      const fakeTx = {}; // your fake transaction
      mockCreateLocation.mockResolvedValueOnce(4);
      //@ts-ignore
      await service.create(fakeOrg, fakeTx);

      // LocationService should receive tx as second arg
      expect(mockCreateLocation).toHaveBeenCalledWith(fakeOrg.location, fakeTx);
      expect(requireAuth).toHaveBeenCalled();
      // DAL create should also receive the same tx
      expect(service['dal'].create).toHaveBeenCalledWith(expect.any(Object), fakeTx);
    });

    it('uses context when passed in', async () => {
      const fakeOrg = {
        location: { place_id: 'placeId', coordinates: { lat: 1, lng: 3 }, name: 'placeName' },
      };
      mockCreateLocation.mockResolvedValueOnce(4);
      const mockContext = { uid: 'abcd123' };

      await service.create(fakeOrg, undefined, mockContext);
      expect(requireAuth).not.toHaveBeenCalled();
    });
  });

  describe('Errors', () => {
    it('Errors if incorrect data passed in', async () => {
      const fakeOrg = {
        location: {},
        name: 'placeName',
      };
      //@ts-expect-error
      await expect(service.create(fakeOrg)).rejects.toThrow('Invalid Organization');
    });

    it('Throws if no location Id', async () => {
      const fakeOrg = {
        location: { place_id: 'placeId', coordinates: { lat: 1, lng: 3 }, name: 'placeName' },
      };
      mockCreateLocation.mockResolvedValueOnce(null);
      await expect(service.create(fakeOrg)).rejects.toThrow(
        'Unable to create location at this time'
      );
    });
  });
});

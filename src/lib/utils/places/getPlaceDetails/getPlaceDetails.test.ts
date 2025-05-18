import { fetchFieldsMock, PlaceMock } from "../../../../../__jestMocks__/@googlemaps/js-api-loader";
import { getPlaceDetails } from "./getPlaceDetails"
import { expect, jest } from '@jest/globals';

describe('getPlaceDetails', () =>{

    beforeEach(() => {
        jest.clearAllMocks();

        fetchFieldsMock.mockResolvedValue({
            id: 'test123',
            location: {lat: 43.5448, lng: -80.2482},
            displayName: 'Mocked Place Name'
        })
    })

    it('returns place details when valid placeId is provided', async () =>{
        const placeId = 'test123'
        const result = await getPlaceDetails(placeId)

        expect(result).toEqual({
            id: 'test123',
            location: {lat: 43.5448, lng: -80.2482},
            displayName: 'Mocked Place Name'
        })
        expect(PlaceMock).toHaveBeenCalledWith({id: placeId})
    })

    it('reurns null and logs error when fetchFields fails', async () =>{
        const error = new Error('Fetch error')
        fetchFieldsMock.mockRejectedValueOnce(error);

        const consoleSpy = jest.spyOn(console, 'error').mockImplementationOnce(() => {})
        const result = await getPlaceDetails('fail-id');

        expect(result).toBeNull()
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching place details:', error);
        consoleSpy.mockRestore()
    })
})
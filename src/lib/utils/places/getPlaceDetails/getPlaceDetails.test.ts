import { getPlaceDetails } from "./getPlaceDetails"
import { expect, jest } from '@jest/globals';

describe('getPlaceDetails', () =>{
    it('returns place details when valid placeId is provided', async () =>{
        const placeId = 'test123'
        const result = await getPlaceDetails(placeId)

        expect(result).toEqual({
            id: 'test123',
            location: {lat: 43.5448, lng: -80.2482},
            displayName: 'Mocked Place Name'
        })
    })

    it('reurns null and logs error when fetchFields fails', async () =>{
        const mockLoader = await import ("@googlemaps/js-api-loader")
        const loaderInstance = new mockLoader.Loader({apiKey: "fake-api-key"});
        const placesLib = await loaderInstance.importLibrary('places')
        const error = new Error('Fetch error');
        (placesLib.Place as unknown as jest.Mock).mockImplementationOnce(() => ({
            fetchFields: jest.fn<() => Promise<unknown>>().mockRejectedValueOnce(error)
        }))

        const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {})
        const result = await getPlaceDetails('fail-id')

        expect(result).toBeNull();
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching place details', error);
        consoleSpy.mockRestore();
    })
})
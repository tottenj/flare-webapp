import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ['places'],
});

export async function getPlaceDetails(placeId: string) {
  const placesLib = (await loader.importLibrary('places')) as google.maps.PlacesLibrary;

  const place = new placesLib.Place({ id: placeId});
  
  
  try {
    const result = await place.fetchFields({
      fields: ['location', 'displayName'],
    });
    
    return result;
  } catch (error) {
    console.error('Error fetching place details:', error);
    return null;
  }
}

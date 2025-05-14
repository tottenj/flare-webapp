"use client"
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  libraries: ['places'],
});



export default async function getPlaces(
  inputText: string,
  requestId: number,
  newestRequestId: number,
  lat?:number,
  long?:number
) {
 

  const placesLib = await loader.importLibrary('places') as google.maps.PlacesLibrary
  try {
    const autosug = placesLib.AutocompleteSuggestion;
    const response = await autosug.fetchAutocompleteSuggestions({
      input: inputText,
      locationBias: { center: { lat: lat || 43.5448, lng: long || -80.2482 }, radius: 50000 },
    });
    if (requestId !== newestRequestId) return [];
    return response.suggestions
      .map((suggestion) => ({
        label: suggestion.placePrediction?.text.text || '', // safely convert to string
        value: suggestion.placePrediction?.placeId || '', // fallback to empty string
      }));
  } catch (error) {
    console.log(error)
    return [];
  }
}

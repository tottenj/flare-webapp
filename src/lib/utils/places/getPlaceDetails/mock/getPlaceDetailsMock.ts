export async function getPlaceDetails() {
  return {
    place: {
      location: {
        id: 'ChIJpTvG15DL1IkRd8S0KlBVNTI',
        name: 'CN Tower, Toronto',
        location: {
          lat: () => 43.65348,
          lng: () => -79.38393,
        },
      },
    },
  };
}

export async function getPlaces(
  inputText: string,
  requestId: number,
  newestRequestId: number,
  lat?: number,
  long?: number
) {

  return [{ label: 'CN Tower, Toronto', value: 'ChIJpTvG15DL1IkRd8S0KlBVNTI' }];



}

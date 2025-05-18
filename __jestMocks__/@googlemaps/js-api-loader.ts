
export class Loader {
  constructor(config: any) {}
  async importLibrary(lib: string) {
    return {
      Place: jest.fn().mockImplementation(({ id }) => ({
        fetchFields: jest.fn().mockResolvedValue({
          id,
          location: { lat: 43.5448, lng: -80.2482 },
          displayName: 'Mocked Place Name',
        }),
      })),
      AutocompleteSuggestion: {
        fetchAutocompleteSuggestions: jest.fn().mockResolvedValue({
          suggestions: [
            {
              placePrediction: {
                text: { text: 'Guelph City Hall' },
                placeId: 'abc123',
                toPlace: () => ({
                  location: { lat: 43.5448, lng: -80.2482 },
                }),
              },
            },
          ],
        }),
      },
    };
  }
}

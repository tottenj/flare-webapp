// jest.setup.ts or wherever you mock Loader globally

// Create a fetchFields mock that tests can control
export const fetchFieldsMock = jest.fn().mockResolvedValue({
  id: 'test123',
  location: { lat: 43.5448, lng: -80.2482 },
  displayName: 'Mocked Place Name',
});

export const PlaceMock = jest.fn().mockImplementation(({ id }) => ({
  fetchFields: fetchFieldsMock,
}));

export class Loader {
  constructor(config: any) {}

  async importLibrary(lib: string) {
    return {
      Place: PlaceMock,
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

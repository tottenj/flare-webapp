jest.mock('./src/bootstrap/admin');
jest.mock('./src/utils/guards/getInternalApiKey', () => ({
  __esModule: true,
  getInternalApiKey: jest.fn(() => 'apikey'),
}));
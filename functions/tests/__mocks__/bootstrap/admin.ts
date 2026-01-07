
export const auth = {
  verifyIdToken: jest.fn(),
  createSessionCookie: jest.fn(),
  deleteUser: jest.fn(),
  verifySessionCookie: jest.fn()
};

export const deleteMock = jest.fn();

export const fileMock = jest.fn(() => ({
  delete: deleteMock,
}));

export const bucketMock = jest.fn(() => ({
  file: fileMock,
}));

export const storage = {
  bucket: bucketMock,
};

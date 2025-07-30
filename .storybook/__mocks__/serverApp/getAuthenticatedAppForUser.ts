
export async function getAuthenticatedAppForUser() {
  return {
    firebaseServerApp: {}, // mock any required methods if needed
    currentUser: {
      uid: 'mock-user-id',
      email: 'mock@example.com',
      displayName: 'Mock User',
    },
  };
}

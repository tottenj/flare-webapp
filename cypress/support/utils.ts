// cypress/support/utils.ts
export const generateTestEmail = (prefix: string = 'test'): string => {
  return `${prefix}${Date.now()}@example.com`;
};

export const createTestUser = (email: string, password: string): Cypress.Chainable => {
  return cy.request({
    method: 'POST',
    url: 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp',
    qs: { key: 'fake-api-key' },
    body: {
      email,
      password,
      returnSecureToken: true,
    },
  });
};

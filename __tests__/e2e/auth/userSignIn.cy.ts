describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('Tests success flow', () => {
    const email = 'user@gmail.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });
    cy.url().should('include', '/dashboard');
  });
});

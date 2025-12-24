describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests success flow', () => {
    const email = "test@gmail.com"
    const password = "password123"

    cy.get('[data-cy="email-input"]').type(email, {force: true});
    cy.get('[data-cy="password-input"]').type(password, {force: true});
    cy.get('[data-cy="submit-button"]').click({force: true});
    cy.url().should('include', '/confirmation');
    
  });
});

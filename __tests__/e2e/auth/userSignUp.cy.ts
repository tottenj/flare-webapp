describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests success flow', () => {
    cy.get('[data-cy="email-input"]').type('test@gmail.com', {force: true});
    cy.get('[data-cy="password-input"]').type('password123', {force: true});
    cy.get('[data-cy="submit-button"]').click();
    cy.url().should('include', '/confirmation');
  });
});

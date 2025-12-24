describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('completes signup flow', () => {
    cy.visit('/signup');

    cy.get('[data-cy="email-input"]').should('be.visible').type(email);
    cy.get('[data-cy="password-input"]').should('be.visible').type(password);
    cy.get('[data-cy="submit-button"]').should('not.be.disabled').click();

    cy.url().should('include', '/confirmation');
    cy.contains('Check your email').should('exist');
  });

});

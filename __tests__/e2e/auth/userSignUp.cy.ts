describe('Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('completes signup flow', () => {
    const email = 'test@gmail.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').should('be.visible').type(email, {force: true});

    cy.get('[data-cy="password-input"]').should('be.visible').type(password, {force: true});

    cy.get('[data-cy="submit-button"]').should('not.be.disabled').click({force: true});

    cy.url().should('include', '/confirmation');
    cy.contains('Thank You For Signing Up!').should('exist');
  });
});

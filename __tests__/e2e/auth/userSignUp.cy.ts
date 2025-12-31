describe('User Sign Up = Successful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests success flow', () => {
    const email = 'test@gmail.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });
    cy.recivedOobCode(email);
    cy.url().should('include', '/confirmation');
  });
});

describe('User Sign Up - Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  it('Tests email already in use flow', () => {
    const email = 'user@gmail.com';
    const password = 'password123';
    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });

    cy.url().should('include', '/signup');
    cy.contains(
      'An account with this email already exists. Please login. If you forgot your password please click forgot password below.'
    ).should('be.visible');
  });

  it('Tests missing password flow', () => {
    const email = 'valid@gmail.com';
    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });

    cy.url().should('include', '/signup');
    cy.contains('Must Enter A Valid Email and Password').should('be.visible');
  });

  it('Tests invalid email flow', () => {
    const email = 'invalid';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });

    cy.url().should('include', '/signup');
    cy.contains('Please enter a valid email address.').should('be.visible');
  });
});

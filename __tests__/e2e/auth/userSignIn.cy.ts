describe('User Sign In - Successful Flow', () => {
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

describe('User Sign In - Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.visit('/signin');
  });

  it('Tests missing password flow', () => {
    const email = 'valid@gmail.com';
    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });

    cy.url().should('include', '/signin');
    cy.contains('Must Enter A Valid Email and Password').should('be.visible');
  });

  it('Tests incorrect password flow', () => {
    const email = 'user@gmail.com';
    const password = 'password1233';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });
    cy.url().should('include', '/signin');
    cy.contains('Invalid email or password.').should('be.visible');
  });

  it('Tests Unkown Email Flow', () => {
    const email = 'userABC@gmail.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });
    cy.url().should('include', '/signin');
    cy.contains('Invalid email or password.').should('be.visible');
  });

  it('Tests unverified email flow', () => {
    const email = 'unverifiedUser@gmail.com';
    const password = 'password123';

    cy.get('[data-cy="email-input"]').type(email, { force: true });
    cy.get('[data-cy="password-input"]').type(password, { force: true });
    cy.get('[data-cy="submit-button"]').click({ force: true });
    cy.contains(
      'Email Address Is Unverified, Please Check Your Email For Verification Instructions'
    ).should('be.visible');
    cy.recivedOobCode(email);
    cy.url().should('include', '/signin');
  });
});

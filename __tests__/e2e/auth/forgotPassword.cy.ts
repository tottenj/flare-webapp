import { userEmailVerified } from '../constants';

describe('Forgot Password Flow', () => {
  const emailInput = '[data-cy="email-input"]:visible';
  const submitButton = '[data-cy="submit-button"]:visible';

  it('Navigates from sign in and sends a password reset email', () => {
    const email = userEmailVerified.email;

    cy.visit('/signin');
    cy.contains('Forgot Password?').click({ force: true });

    cy.url().should('include', '/forgot-password');
    cy.contains('h1', 'Forgot Password').should('be.visible');
    cy.get(emailInput).first().type(email, { force: true });
    cy.get(submitButton).first().click({ force: true });

    cy.receivedPasswordResetOobCode(email);
  });

  it('Clears validation error state after a successful retry', () => {
    const email = userEmailVerified.email;

    cy.visit('/forgot-password');
    cy.contains('h1', 'Forgot Password').should('be.visible');

    cy.get(submitButton).first().click({ force: true });
    cy.contains('Email is required').should('be.visible');

    cy.get(emailInput).first().type(email, { force: true });
    cy.get(submitButton).first().click({ force: true });

    cy.contains('Email is required').should('not.exist');
    cy.receivedPasswordResetOobCode(email);
  });
});

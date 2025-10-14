/// <reference types="cypress" />

import { unverifiedUser, verifiedUser } from '../../support/constants';

describe('Sign In Form', () => {
  before(() => {
    cy.clearAllEmulators();
    cy.createUser(verifiedUser.email, verifiedUser.password, verifiedUser.name, true, false);
  });

  beforeEach(() => {
    cy.visit('/signin');
  });

  describe('error signing in', () => {
    it('should log user out if not email verified', () => {
      cy.createUser(unverifiedUser.email, unverifiedUser.password, 'test', false, false);
      cy.get('[data-testid="email"]').type(unverifiedUser.email);
      cy.get('[data-testid="password"]').type(unverifiedUser.password);
      cy.get('form').submit();
      cy.contains('Please Verify Email');
      cy.contains('Verification email sent to: useremail@gmail.com').should('be.visible');
    });

    it('should error on Incorrect password', () => {
      cy.get('[data-testid="email"]').type(verifiedUser.email);
      cy.get('[data-testid="password"]').type('wrongPassword');
      cy.get('form').submit();
      cy.contains('Incorrect password.');
    });
  });

  describe('Successful sign in', () => {
    it('should log user in if email verified', () => {
      cy.get('[data-testid="email"]').type(verifiedUser.email);
      cy.get('[data-testid="password"]').type(verifiedUser.password);
      cy.get('form').submit();
      cy.url().should('include', '/dashboard');
    });
  });
});

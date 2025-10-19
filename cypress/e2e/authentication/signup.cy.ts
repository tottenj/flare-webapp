/// <reference types="cypress" />
import { createUser } from '../../support/constants/User';

const projectId = Cypress.env('FIREBASE_PROJECT_ID');

describe('SignUpForm', () => {
  beforeEach(() => {
    cy.wait(2000);
    cy.visit('/signup');
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', () => {
      cy.get('form').should('exist').and('be.visible');
      cy.get('form button[type="submit"]').should('not.be.disabled');
      cy.get('form button[type="submit"]').click();
      cy.contains('Must have both email and password').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('form').submit();
      cy.contains('Please enter a valid email address.').should('be.visible');
    });
  });

  describe('Successful Sign Up', () => {
    it('should create and verify a user', () => {
      cy.intercept('/api/loginToken').as('token');

      cy.get(`input[name="email"]`).type(createUser.email);
      cy.get(`input[name="password"]`).type(createUser.password);
      cy.get('form button[type="submit"]').click();
      cy.wait('@token');
      cy.url().should('include', 'confirmation');
    });

    it('should send an email verification code', () => {
      cy.request({
        method: 'GET',
        url: `http://localhost:9099/emulator/v1/projects/${projectId}/oobCodes`,
      }).then((response) => {
        cy.log(response.body);
        expect(response.body).to.have.property('oobCodes');
        expect(response.body.oobCodes).to.be.an('array');
        const verificationCodeSent = response.body.oobCodes.some((code: any) => {
          return (
            code.requestType === 'VERIFY_EMAIL' && code.email === createUser.email.toLowerCase()
          );
        });
        expect(verificationCodeSent).to.be.true;
      });
    });

    // it("Checks if user exists", () => {
    //   cy.userExists(createUser.email, createUser.password, false).shouldMatch(createUserResponse)
    // })
  });

  describe('Error Cases', () => {
    it('should error if email already taken', () => {
      cy.get(`input[name="email"]`).type(createUser.email);
      cy.get(`input[name="password"]`).type(createUser.password);
      cy.get('form').submit();
      cy.checkToast('Email is already in use');
    });
  });

  describe('Google Sign-In Button', () => {
    it('should render Google sign-in button', () => {
      cy.get('[data-testid="google-signin-button"]').should('exist');
    });
  });
});

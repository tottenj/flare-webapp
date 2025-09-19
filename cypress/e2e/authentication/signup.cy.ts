/// <reference types="cypress" />
import { unverifiedUser, verifiedOrg } from '../../support/constants';
import { UserFixture } from '../../types/UserFixture';

const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const apiKey = Cypress.env('FIREBASE_API_KEY'); // Get the API Key from Cypress env

describe('SignUpForm', () => {
  beforeEach(() => {
    cy.visit('/signup');
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', () => {
      cy.get('form').submit();
      cy.contains('Error with email or password').should('be.visible');
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
        cy.get(`input[name="email"]`).type(unverifiedUser.email);
        cy.get(`input[name="password"]`).type(unverifiedUser.password);
        cy.get('form').submit();
        cy.contains('User created successfully').should('be.visible');
    });

    it('should send an email verification code', () => {
        cy.request({
          method: 'GET',
          url: `http://localhost:9099/emulator/v1/projects/${projectId}/oobCodes`,
        }).then((response) => {
          cy.log(response.body)
          expect(response.body).to.have.property('oobCodes');
          expect(response.body.oobCodes).to.be.an('array');
          const verificationCodeSent = response.body.oobCodes.some(
            (code: any) => {
              return code.requestType === 'VERIFY_EMAIL' && code.email === unverifiedUser.email.toLowerCase()
            }
          );
          expect(verificationCodeSent).to.be.true;
        });
    });
  });

  describe('Error Cases', () => {

    it("should error if email already taken", () => {
       cy.get(`input[name="email"]`).type(verifiedOrg.email);
       cy.get(`input[name="password"]`).type(verifiedOrg.password);
       cy.get('form').submit();
       cy.checkToast("Email is already in use")
    })

  });

  describe('Google Sign-In Button', () => {
    it('should render Google sign-in button', () => {
      cy.get('[data-testid="google-signin-button"]').should('exist');
    });
  });
});

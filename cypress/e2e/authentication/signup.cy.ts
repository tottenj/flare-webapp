/// <reference types="cypress" />

import { password } from "@/components/inputs/textInput/TextInput.stories";


const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const apiKey = Cypress.env('FIREBASE_API_KEY'); // Get the API Key from Cypress env


describe('SignInForm', () => {

  beforeEach(() => {
    cy.visit('/signup');
  });

  interface FirebaseErrorResponse {
    error?: {
      message: string;
      code: number;
    };
  }

  describe('Form Validation', () => {
    it('should show validation errors for empty form submission', () => {
      cy.get('form').submit();
      cy.contains('Error with email or password').should('be.visible');
    });

    it('should validate email format', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="password"]').type('password123');
      cy.get('form').submit();
      cy.contains('An error occurred. Please try again').should('be.visible');
    });
  });

  describe('Successful Sign Up', () => {
    it('should create and verify a user', () => {
      const testEmail = `test${Date.now()}@example.com`;
      const testPassword = 'password123';
      const projectId = Cypress.env('FIREBASE_PROJECT_ID');

      cy.request({
        method: 'POST',
        url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        body: {
          email: testEmail,
          password: testPassword,
          returnSecureToken: true,
        },
      }).then((signUpResponse) => {
        expect(signUpResponse.status).to.eq(200);

        const idToken = signUpResponse.body.idToken
        const userId = signUpResponse.body.localId
        Cypress.env('createdUserId', userId)

        cy.request({
          method: 'POST',
          url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          body: {
            idToken: idToken, // <-- INCLUDE THE ID TOKEN IN THE BODY
          },
        }).then((listResponse) => {
          expect(listResponse.body).to.have.property('users').and.be.an('array').with.lengthOf(1);

          cy.request({
            method: 'GET',
            url: `http://localhost:9099/emulator/v1/projects/${projectId}/oobCodes`,
          }).then((oobResponse) => {
            expect(oobResponse.allRequestResponses.length > 0)
            console.log(oobResponse.allRequestResponses)
          });

        });
      });
    });
  });


  describe('Error Cases', () => {
    const existingEmail = 'existing@example.com';
    const existingPassword = 'password123';

    beforeEach(() => {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:9099/emulator/v1/projects/${projectId}/accounts`,
      });
    })

    before(() => {
      cy.request<FirebaseErrorResponse>({
        method: 'POST',
        url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        body: {
          email: existingEmail,
          password: existingPassword,
          returnSecureToken: true,
        },
      });
    });

    it('should show error for existing email', () => {
      cy.request({
        method: "POST",
        url: `https://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
        body: {
          email: existingEmail,
          password: existingPassword,
          returnSecureToken: true
        }
      })
      cy.contains('Email is already in use').should('be.visible');
    });
  });

  describe('Google Sign-In Button', () => {
    it('should render Google sign-in button', () => {
      cy.get('[data-testid="google-signin-button"]').should('exist');
    });
  });
});

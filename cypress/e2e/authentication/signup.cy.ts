/// <reference types="cypress" />

import { setupFirebase } from "../../support/auth";

// cypress/e2e/signin.cy.ts
describe('SignInForm', () => {
    before(() => {
      setupFirebase();
    })
  
    beforeEach(() => {
      cy.clearAuthEmulator();
      cy.visit('/signin');
    });
  
    interface FirebaseErrorResponse {
      error?: {
        message: string;
        code: number;
      };
    }
  
    interface FirebaseUserResponse {
      users?: Array<{
        email: string;
        localId: string;
      }>;
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
        cy.contains(/invalid email|error with email/i).should('be.visible');
      });
    });
  
    describe('Successful Sign Up', () => {
      it('should successfully create a new user', () => {
        const testEmail = `test${Date.now()}@example.com`;
        const testPassword = 'password123';
        
        cy.signUpWithEmailAndPassword(testEmail, testPassword);
        
        // Check for success message
        cy.contains('User created successfully').should('be.visible');
        
        // Verify user was created in emulator
        cy.request<FirebaseUserResponse>({
          method: 'POST',
          url: 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:lookup',
          qs: { key: 'fake-api-key' },
          body: { email: testEmail }
        }).then((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.users?.[0].email).to.eq(testEmail);
        });
      });
    });
  
    describe('Error Cases', () => {
      const existingEmail = 'existing@example.com';
      const existingPassword = 'password123';
      
      before(() => {
        // Create a user in emulator to test duplicate case
        cy.request<FirebaseErrorResponse>({
          method: 'POST',
          url: 'http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp',
          qs: { key: 'fake-api-key' },
          body: {
            email: existingEmail,
            password: existingPassword,
            returnSecureToken: true
          }
        });
      });
  
      it('should show error for existing email', () => {
        cy.signUpWithEmailAndPassword(existingEmail, 'anypassword');
        cy.contains('Email is already in use').should('be.visible');
      });
  
      it('should show generic error for other failures', () => {
        // Mock a failure case
        cy.intercept('POST', '**/emailAndPasswordAction', {
          statusCode: 500,
          body: { message: 'An error occurred. Please try again.' }
        }).as('signUpRequest');
        
        cy.signUpWithEmailAndPassword('test@example.com', 'password123');
        cy.wait('@signUpRequest');
        cy.contains('An error occurred').should('be.visible');
      });
    });
  
    describe('Google Sign-In Button', () => {
      it('should render Google sign-in button', () => {
        cy.get('[data-testid="google-signin-button"]').should('exist');
      });
    });
  });
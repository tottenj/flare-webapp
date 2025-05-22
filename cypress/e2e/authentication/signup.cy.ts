/// <reference types="cypress" />
import { UserFixture } from '../../types/UserFixture';

const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const apiKey = Cypress.env('FIREBASE_API_KEY'); // Get the API Key from Cypress env

describe('SignUpForm', () => {

  before(() =>{
    cy.clearAllEmulators()
  })

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
    before(() => {
      cy.clearAllEmulators();
    });

    it('should create and verify a user', () => {
      cy.fixture('user').then((user: UserFixture) => {
        cy.get(`input[name="email"]`).type(user.email);
        cy.get(`input[name="password"]`).type(user.password);
        cy.get('form').submit();
        cy.contains('User created successfully').should('be.visible');

        cy.request({
          method: 'POST',
          url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
          body: {
            email: user.email,
            password: user.password,
            returnSecureToken: true,
          },
        }).then((loginRes) => {
          const idToken = loginRes.body.idToken;

          cy.request({
            method: 'POST',
            url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
            body: {
              idToken,
            },
          }).then((lookupRes) => {
            expect(lookupRes.status).to.eq(200);
            expect(lookupRes.body.users[0].email).to.eq(user.email);
            cy.url().should("include", "/confirmation")
          });
        });
      });
    });



    it('should send an email verification code', () => {
      cy.fixture('user').then((user: UserFixture) => {
        cy.request({
          method: 'GET',
          url: `http://localhost:9099/emulator/v1/projects/${projectId}/oobCodes`,
        }).then((response) => {
          expect(response.body).to.have.property('oobCodes');
          expect(response.body.oobCodes).to.be.an('array');
          const verificationCodeSent = response.body.oobCodes.some(
            (code:any) => code.requestType === 'VERIFY_EMAIL' && code.email === user.email
          );
          expect(verificationCodeSent).to.be.true;
        });
      });
    });
  });

  describe('Error Cases', () => {
    it('should error on email already taken', () => {
      cy.fixture('user').then((user: UserFixture) => {
        it('should show error for existing email', () => {
          cy.request({
            method: 'POST',
            url: `https://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            body: {
              email: user.email,
              password: user.password,
              returnSecureToken: true,
            },
          }).then(() => {
            cy.contains('Email is already in use').should('be.visible');
          })
        });
      });
    });
  });

  describe('Google Sign-In Button', () => {
    it('should render Google sign-in button', () => {
      cy.get('[data-testid="google-signin-button"]').should('exist');
    });
  });
});

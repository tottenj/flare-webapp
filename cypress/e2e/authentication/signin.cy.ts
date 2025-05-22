/// <reference types="cypress" />
import cypress from 'cypress';
import { UserFixture } from '../../types/UserFixture';

const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const apiKey = Cypress.env('FIREBASE_API_KEY'); // Get the API Key from Cypress env
const email = "userEmail@gmail.com"
const password = 'password';
const verifedUserEmail = "userEmailVerified@gmail.com"
const verifiedUserPassword = "password"

describe("Sign In Form", () =>{

    before(() =>{
        cy.clearAllEmulators()
        cy.createUser(verifedUserEmail, verifiedUserPassword, true)
        cy.createUser(email, password);
    })

    beforeEach(() =>{
        cy.visit('/signin');
    })


    describe("error signing in", () =>{
        it("should log user out if not email verified", () =>{
            cy.get('[data-testid="email"]').type(email)
            cy.get('[data-testid="password"]').type(password)
            cy.get('form').submit()
            cy.contains("Please Verify Email")
            cy.contains('Verification email sent to: useremail@gmail.com').should('be.visible');
        })

        it("should error on Incorrect password", () =>{
            cy.get('[data-testid="email"]').type(email);
            cy.get('[data-testid="password"]').type("wrongPassword");
            cy.get('form').submit();
            cy.contains('Incorrect password.');
        })
    })

    describe("Successful sign in", () =>{
        it("should log user in if email verified", () =>{
            cy.get('[data-testid="email"]').type(verifedUserEmail);
            cy.get('[data-testid="password"]').type(verifiedUserPassword);
            cy.get('form').submit();
            cy.url().should("include", "/home")
        })
    })

})
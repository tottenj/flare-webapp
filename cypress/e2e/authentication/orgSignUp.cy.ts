/// <reference types="cypress" />
import { UserFixture } from '../../types/UserFixture';

const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const apiKey = Cypress.env('FIREBASE_API_KEY'); // Get the API Key from Cypress env

const orgName = "Flare"
const orgPassword = "password"


describe("Org Sign Up Form", () =>{


    beforeEach(() =>{
        cy.visit("/flare-signin")
    })

    describe("Success", () =>{
        it('Signs Up Organization on successful form submit', () => {
            cy.get('input[name="orgName"]').type(orgName);
            cy.get('input[name="orgEmail"]').type(orgPassword);
            
            cy.get('form').submit();
        });
    })
    

    
})
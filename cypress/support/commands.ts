/// <reference types="cypress" />

import cypress from "cypress";

// cypress/support/commands.ts
const apiKey = Cypress.env('FIREBASE_API_KEY');
const projectId = Cypress.env('FIREBASE_PROJECT_ID');

Cypress.Commands.add(
  'createUser',
  (email: string, password: string, emailVerified: boolean = false) => {
        return cy
          .request({
            method: 'POST',
            url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`,
            body: {
              email,
              password,
              returnSecureToken: true,
            },
          })
          .then((signUpResponse) => {
            const idToken = signUpResponse.body.idToken;
            const createdEmail = signUpResponse.body.email;

            if (!emailVerified) {
              return signUpResponse.body;
            }
            return cy
              .request({
                // <-- RETURN THIS COMMAND!
                method: 'POST',
                url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${apiKey}`,
                body: {
                  requestType: 'VERIFY_EMAIL',
                  idToken: idToken, // Use the ID token obtained from the signup response
                },
              })
              .then((sendOobCodeResponse) => {
                expect(sendOobCodeResponse.status).to.eq(200);
                expect(sendOobCodeResponse.body).to.have.property('email', createdEmail);

                cy.log(
                  `Email verification code successfully generated in emulator for ${createdEmail}. Proceeding to fetch and apply...`
                );

                return cy
                  .request({
                    method: 'GET',
                    url: `http://localhost:9099/emulator/v1/projects/${projectId}/oobCodes`,
                  })
                  .then((oobCodesResponse) => {
                    expect(oobCodesResponse.status).to.eq(200);
                    expect(oobCodesResponse.body).to.have.property('oobCodes');
                    expect(oobCodesResponse.body.oobCodes).to.be.an('array');

                   

                    const verificationCodeObject = oobCodesResponse.body.oobCodes.find(
                      (code: any) =>
                        code.requestType === 'VERIFY_EMAIL' && code.email === createdEmail // Use the email from the signup response
                    );

                    // Assert that the code was found
                    expect(
                      verificationCodeObject,
                      `Expected VERIFY_EMAIL code for ${createdEmail} not found after generation.`
                    ).to.exist;

                    const verificationOobCode = verificationCodeObject.oobCode;
                    cy.log(`Found VERIFY_EMAIL OOB code: ${verificationOobCode}. Applying code...`);

                    return cy
                      .request({
                        method: 'POST',
                        url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:update?key=${apiKey}`, // Corrected endpoint!
                        body: {
                          oobCode: verificationOobCode,
                        },
                      })
                      .then((applyOobCodeResponse) => {
                     
                        return applyOobCodeResponse.body;
                      });
                  });
              });
          });
      });
 

Cypress.Commands.add('loginUser', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    body: {
      email,
      password,
      returnSecureToken: true,
    },
  });
});

Cypress.Commands.add('clearAllEmulators', () => {
  cy.request({
    method: 'DELETE',
    url: `http://localhost:9099/emulator/v1/projects/${projectId}/accounts`,
  });

  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/reset',
  });
});

Cypress.Commands.add('clearFirestoreEmulators', () => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/reset',
  });
});

Cypress.Commands.add('clearAuthEmulator', () => {
  cy.request({
    method: 'DELETE',
    url: `http://localhost:9099/emulator/v1/projects/${projectId}/accounts`,
  });
});

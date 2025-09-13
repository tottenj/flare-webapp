/// <reference types="cypress" />

// Constants
const apiKey = Cypress.env('FIREBASE_API_KEY');
const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const AUTH_EMULATOR = `http://localhost:9099/identitytoolkit.googleapis.com/v1`;
const AUTH_ADMIN = `http://localhost:9099/emulator/v1/projects/${projectId}`;
const FIRESTORE_ADMIN = `http://localhost:8080`;

// Helper Functions
function signUpUser(email: string, password: string) {
  return cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:signUp?key=${apiKey}`,
      body: { email, password, returnSecureToken: true },
    })
    .then((response) => response.body);
}

function sendVerifyEmail(idToken: string) {
  return cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:sendOobCode?key=${apiKey}`,
      body: { requestType: 'VERIFY_EMAIL', idToken },
    })
    .then((response) => response.body);
}

function getOobCode(email: string) {
  return cy.request('GET', `${AUTH_ADMIN}/oobCodes`).then((response) => {
    const code = response.body.oobCodes.find(
      (c: any) => c.requestType === 'VERIFY_EMAIL' && c.email === email
    );
    expect(code, `Expected VERIFY_EMAIL code for ${email}`).to.exist;
    return code.oobCode;
  });
}

function applyOobCode(oobCode: string) {
  return cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:update?key=${apiKey}`,
      body: { oobCode },
    })
    .then((response) => response.body);
}

// Cypress Commands
Cypress.Commands.add(
  'createUser',
  (email: string, password: string, emailVerified: boolean = false) => {
    return signUpUser(email, password).then((signUpRes) => {
      if (!emailVerified) {
        return signUpRes;
      }
      return sendVerifyEmail(signUpRes.idToken).then(() =>
        getOobCode(signUpRes.email).then((oobCode) =>
          applyOobCode(oobCode).then((verifyRes) => verifyRes)
        )
      );
    });
  }
);

Cypress.Commands.add('loginUser', (email: string, password: string) => {
  return cy.request({
    method: 'POST',
    url: `${AUTH_EMULATOR}/accounts:signInWithPassword?key=${apiKey}`,
    body: { email, password, returnSecureToken: true },
  });
});

Cypress.Commands.add('clearAllEmulators', () => {
  cy.request('DELETE', `${AUTH_ADMIN}/accounts`);
  cy.request('POST', `${FIRESTORE_ADMIN}/reset`);
});

Cypress.Commands.add('clearFirestoreEmulators', () => {
  cy.request('POST', `${FIRESTORE_ADMIN}/reset`);
});

Cypress.Commands.add('clearAuthEmulator', () => {
  cy.request('DELETE', `${AUTH_ADMIN}/accounts`);
});

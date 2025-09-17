/// <reference types="cypress" />

import { UserFixture } from '../types/UserFixture';

// Constants
const apiKey = Cypress.env('FIREBASE_API_KEY');
const projectId = Cypress.env('FIREBASE_PROJECT_ID');
const AUTH_EMULATOR = `http://localhost:9099/identitytoolkit.googleapis.com/v1`;
const AUTH_ADMIN = `http://localhost:9099/emulator/v1/projects/${projectId}`;
const FIRESTORE_ADMIN = `http://localhost:8080`;

// Helper Functions
function signUpUser(email: string, password: string, name: string, isOrg: boolean = false) {
  return cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:signUp?key=${apiKey}`,
      body: { email, password, returnSecureToken: true },
    })
    .then((response) => {
      return cy
        .request({
          method: 'POST',
          url: '/api/test/testCreateUser',
          body: { email, uid: response.body.localId, name, isOrg },
        })
        .then(() => response.body);
    });
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

Cypress.Commands.add(
  'createUser',
  (
    email?: string,
    password?: string,
    name?: string,
    emailVerified: boolean = true,
    isOrg: boolean = false
  ) => {
    const doSignUp = (finalEmail: string, finalPassword: string, finalName: string) => {
      return signUpUser(finalEmail, finalPassword, finalName, isOrg).then((signUpRes) => {
        if (!emailVerified) {
          return { ...signUpRes, email: finalEmail, password: finalPassword, name: finalName };
        }

        return sendVerifyEmail(signUpRes.idToken)
          .then(() => getOobCode(signUpRes.email))
          .then((oobCode) => applyOobCode(oobCode))
          .then((verifyRes) => {
            return {
              ...signUpRes,
              ...verifyRes,
              email: finalEmail,
              password: finalPassword,
              name: finalName,
            };
          });
      });
    };

    if (!email || !password || !name) {
      return cy.fixture('user.json').then((user: UserFixture) => {
        return doSignUp(user.email, user.password, user.name);
      });
    }
    return doSignUp(email, password, name);
  }
);

Cypress.Commands.add('loginUser', (email?: string, password?: string) => {
  const doLoginUser = (finalEmail: string, finalPassword: string) => {
    return cy.session([finalEmail, finalPassword], () => {
      return cy
        .request({
          method: 'POST',
          url: `${AUTH_EMULATOR}/accounts:signInWithPassword?key=${apiKey}`,
          body: {
            email: finalEmail,
            password: finalPassword,
            returnSecureToken: true,
          },
        })
        .then((response) => {
          const idToken = response.body.idToken;
          return cy.request('POST', '/api/test/testLogin', { idToken }).then((resp) => resp.body);
        });
    });
  };
  if (!email || !password) {
    return cy.fixture<UserFixture>('user.json').then((fixtureUser) => {
      return doLoginUser(fixtureUser.email, fixtureUser.password);
    });
  }
  return doLoginUser(email, password);
});

Cypress.Commands.add('logoutUser', (): Cypress.Chainable => {
  return cy.request({
    method: 'POST',
    url: '/api/test/testLogout',
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

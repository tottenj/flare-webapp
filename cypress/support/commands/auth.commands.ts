/// <reference types="cypress" />
import { login } from '../firebase';
import { apiKey, AUTH_ADMIN, AUTH_EMULATOR } from './env';

function signUpUser(email: string, password: string, name: string, isOrg: boolean = false) {
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

function assertVerifyEmailOobSent(email: string): void {
  const normalizedEmail = email.toLowerCase();

  cy.request('GET', `${AUTH_ADMIN}/oobCodes`)
    .its('body.oobCodes')
    .should((oobCodes: any[]) => {
      const code = oobCodes.find(
        (c) => c.requestType === 'VERIFY_EMAIL' && c.email?.toLowerCase() === normalizedEmail
      );

      expect(code, `Expected VERIFY_EMAIL OOB code to be sent for ${normalizedEmail}`).to.exist;
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

Cypress.Commands.add('recivedOobCode', (email: string) => {
  assertVerifyEmailOobSent(email);
});

Cypress.Commands.add(
  'createUser',
  (
    email: string,
    password: string,
    name: string,
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
    return doSignUp(email, password, name);
  }
);

Cypress.Commands.add('loginUser', (email: string, password: string) => {
  return cy.session([email, password], () => {
    cy.request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:signInWithPassword?key=${apiKey}`,
      body: { email, password, returnSecureToken: true },
    }).then((signInResponse) => {
      const idToken = signInResponse.body.idToken;
      cy.request('POST', '/api/test/testLogin', { idToken });
    });
  });
});

Cypress.Commands.add('clientLogin', (email: string, password: string) => {
  cy.window().its('auth').should('exist');

  cy.window().then(async (win: any) => {
    await win.signInWithEmailAndPassword(win.auth, email, password);
  });

  cy.window().its('auth.currentUser', { timeout: 10000 }).should('not.be.null');
});

Cypress.Commands.add('logoutUser', (): Cypress.Chainable => {
  return cy.request({
    method: 'POST',
    url: '/api/test/testLogout',
  });
});

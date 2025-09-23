/// <reference types="cypress" />

import { org, verifiedOrg, verifiedUser } from './constants';
import { functions, httpsCallable } from './firebaseClient';
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
  const doLoginUser = (finalEmail: string, finalPassword: string) => {
    cy.session([finalEmail, finalPassword], () => {
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
  return doLoginUser(email, password);
});

Cypress.Commands.add('logoutUser', (): Cypress.Chainable => {
  return cy.request({
    method: 'POST',
    url: '/api/test/testLogout',
  });
});

Cypress.Commands.add('createAndLoginUser', (email?: string, password?: string, name?: string) => {
  let trueName: string;
  let truePass: string;
  let trueEmail: string;

  if (!email || !password || !name) {
    trueName = verifiedUser.name;
    truePass = verifiedUser.password;
    trueEmail = verifiedUser.email;
  } else {
    trueName = name;
    truePass = password;
    trueEmail = email;
  }

  cy.createUser(trueEmail, truePass, trueName, true, false).then(() => {
    cy.loginUser(trueEmail, truePass);
  });
});

Cypress.Commands.add(
  'createAndLoginOrganization',
  (email?: string, password?: string, name?: string) => {
    let trueName: string;
    let truePass: string;
    let trueEmail: string;

    if (!email || !password || !name) {
      trueName = org.name;
      truePass = org.password;
      trueEmail = org.email;
    } else {
      trueName = name;
      truePass = password;
      trueEmail = email;
    }

    cy.createUser(trueEmail, truePass, trueName, true, true).then(() => {
      cy.loginUser(trueEmail, truePass);
    });
  }
);

Cypress.Commands.add('seedDb', () => {
  const seed = httpsCallable(functions, 'seedDb');
  cy.wrap(null).then(() => {
    seed();
  });
});

Cypress.Commands.add('loginTestUser', () => {
  cy.loginUser('userOne@gmail.com', 'password');
});

Cypress.Commands.add('loginTestOrg', () => {
  cy.loginUser('orgOne@gmail.com', 'password');
});

Cypress.Commands.add('checkToast', (message: string) => {
  cy.contains('.Toastify__toast', message).should('be.visible');
});

Cypress.Commands.add('clearAllEmulators', () => {
  cy.clearFirestoreEmulators();
  cy.clearAuthEmulator();
});

Cypress.Commands.add('clearFirestoreEmulators', () => {
  cy.request('POST', `${FIRESTORE_ADMIN}/reset`);
});

Cypress.Commands.add('clearAuthEmulator', () => {
  cy.request('DELETE', `${AUTH_ADMIN}/accounts`);
});

Cypress.Commands.add('checkExistance', (funcs: Record<string, () => Cypress.Chainable>) => {
  Object.values(funcs).forEach((fn) => {
    fn().should('exist');
  });
});

Cypress.Commands.add('clearForm', () => {
  cy.get('form input:visible').each(($input) => {
    cy.wrap($input).clear({ force: true });
  });
});

Cypress.Commands.add(
  'usePlacesInput',
  (
    selector: string,
    loc: string = verifiedOrg.location.name,
    contains: string = 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada'
  ) => {
    const location = cy.get(selector);
    cy.intercept('POST', '**/places.googleapis.com/**').as('places');
    location.type(loc, { delay: 200 });
    cy.contains(contains).should('exist');
    cy.wait('@places');
    cy.get('ul[role="listbox"] li[role="option"]')
      .contains(contains)
      .should('be.visible')
      .click({ force: true });
  }
);

Cypress.Commands.add('userExists', (email: string) => {
  return cy
    .request({
      method: 'POST',
      url: `https://identitytoolkit.googleapis.com/v1/accounts:createAuthUri?key=${apiKey}`,
      body: { identifier: email, continueUri: 'http://localhost:8080/app' },
    })
    .then((resp) => {
      return resp.body && resp.body?.registered === true;
    });
});

Cypress.Commands.add('waitForAuthEmulator', () => {
  const AUTH_ADMIN = `http://localhost:9099/emulator/v1/projects/${Cypress.env('FIREBASE_PROJECT_ID')}`;

  cy.request({
    method: 'GET',
    url: `${AUTH_ADMIN}/accounts`,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status !== 200) {
      // retry after 500ms until ready
      cy.wait(500);
      cy.waitForAuthEmulator();
    }
  });
});

Cypress.Commands.add('waitForFirestoreEmulator', () => {
  const FIRESTORE_ADMIN = `http://localhost:8080`;

  cy.request({
    method: 'GET',
    url: `${FIRESTORE_ADMIN}/documents`,
    failOnStatusCode: false,
  }).then((resp) => {
    if (resp.status !== 200) {
      cy.wait(500);
      cy.waitForFirestoreEmulator();
    }
  });
});

Cypress.Commands.add('waitForEmulators', () => {
  cy.waitForAuthEmulator();
  cy.waitForFirestoreEmulator();
});


Cypress.Commands.add("getDocument", (path: string) => {
  return cy.request({
    method: "POST",
    url: `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${path}`
  })
})
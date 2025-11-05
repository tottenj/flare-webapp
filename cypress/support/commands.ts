/// <reference types="cypress" />

import { org, verifiedUser } from './constants';
import { createOrg } from './constants/Organization';
import { compareWithTolerance, pickShared } from './helpers';

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
    .then((response) => response.body)
}

function decodeFirestoreDocument(doc: any) {
  const parseValue = (val: any): any => {
    if ('stringValue' in val) return val.stringValue;
    if ('booleanValue' in val) return val.booleanValue;
    if ('nullValue' in val) return null;
    if ('integerValue' in val) return parseInt(val.integerValue, 10);
    if ('doubleValue' in val) return val.doubleValue;
    if ('geoPointValue' in val) return val.geoPointValue;
    if ('mapValue' in val) {
      return decodeFirestoreDocument({ fields: val.mapValue.fields });
    }
    if ('arrayValue' in val) {
      return (val.arrayValue.values || []).map(parseValue);
    }
    return val;
  };

  const fields = doc.fields || {};
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, parseValue(v)]));
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
    return cy
      .session([finalEmail, finalPassword], () => {
        // setup runs once per session
        cy.request({
          method: 'POST',
          url: `${AUTH_EMULATOR}/accounts:signInWithPassword?key=${apiKey}`,
          body: {
            email: finalEmail,
            password: finalPassword,
            returnSecureToken: true,
          },
        }).then((response) => {
           const { idToken } = response.body;
          return cy.request('POST', '/api/test/testLogin', { idToken });
        });
      })
      .then((sessionResp) => {
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
          .then((response) => response);
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

Cypress.Commands.add('loginTestUser', () => {
  cy.loginUser('userOne@gmail.com', 'password');
});

Cypress.Commands.add('loginTestOrg', () => {
  cy.loginUser('orgOne@gmail.com', 'password');
});

Cypress.Commands.add('loginVerifiedOrg', () => {
  cy.loginUser('verifiedOrg@gmail.com', 'password');
});

Cypress.Commands.add('checkToast', (message: string) => {
  cy.contains('.Toastify__toast', message).should('be.visible');
});

Cypress.Commands.add('clearAllEmulators', () => {
 // cy.clearFirestore();
  cy.clearAuth();
});

Cypress.Commands.add('clearFirestore', () => {
  cy.request('POST', `${FIRESTORE_ADMIN}/reset`).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('clearAuth', () => {
  cy.request('DELETE', `${AUTH_ADMIN}/accounts`).then((response) => {
    expect(response.status).to.eq(200);
  });
});

Cypress.Commands.add('seedDb', (maxRetries = 5) => {
  const attemptSeed = (retryCount = 0): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'POST',
        url: 'http://127.0.0.1:5001/flare-7091a/us-central1/seedDb',
        failOnStatusCode: false,
        timeout: 10000,
        body: {
          data: {},
        },
      })
      .then((response) => {
        if (
          response.status === 200 &&
          response.body.result &&
          response.body.result.success === true
        ) {
          cy.log('✅ Database seeded successfully');
          return cy.wrap(response.body.result);
        } else if (retryCount < maxRetries) {
          cy.log(`⏳ Seed failed (attempt ${retryCount + 1}/${maxRetries}), retrying...`);
          // It's good practice to chain cy.wait and then call the next attempt
          return cy.wait(2000).then(() => attemptSeed(retryCount + 1));
        } else {
          throw new Error(
            `Failed to seed database after ${maxRetries} attempts. Status: ${response.status}. Response: ${JSON.stringify(response.body)}`
          );
        }
      });
  };

  return attemptSeed();
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
    loc: string = createOrg.location.name,
    contains: string = 'Toronto Pearson International Airport (YYZ), Silver Dart Drive, Mississauga, ON, Canada'
  ) => {
    const location = cy.get(selector);
    const newContains = "CN Tower, Toronto"
    //cy.intercept('POST', '**/places.googleapis.com/**').as('places');
    location.type(loc);
    cy.contains(newContains).should('exist');
    //cy.wait('@places');
    cy.get('ul[role="listbox"] li[role="option"]')
      .contains(newContains)
      .should('be.visible')
      .click({ force: true });
  }
);

Cypress.Commands.add('userExists', (email: string, password: string, org: boolean = true) => {
  return cy.loginUser(email, password).then((resp) => {
    expect(resp.body.localId).to.not.be.null;
    expect(resp.body.localId).to.not.be.undefined;
    const col = org ? 'Organizations' : 'Users';

    return cy.getDocument(`${col}/${resp.body.localId}`, resp.body.idToken).then((response) => {
      //expect(response.body.id).not.to.be.null
      //expect(response.body.id).not.to.be.undefined
      return response.body;
    });
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

Cypress.Commands.add('getDocument', (path: string, idToken: string) => {
  const firestoreEmulatorFullUrl = `http://localhost:8080/v1/projects/${projectId}/databases/(default)/documents/${path}`;
  const headers = { Authorization: `Bearer ${idToken}` };

  const MAX_RETRIES = 10; // always retry 10 times
  const DELAY_MS = 500; // wait 500ms between retries

  const attempt = (retryCount: number): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'GET',
        url: firestoreEmulatorFullUrl,
        headers,
        failOnStatusCode: false, // allow 404
      })
      .then((resp) => {
        if (resp.status === 200) {
          return decodeFirestoreDocument(resp.body); // document exists
        } else if (retryCount > 0) {
          cy.wait(DELAY_MS);
          return attempt(retryCount - 1); // retry
        } else {
          throw new Error(`Document at path "${path}" not found after ${MAX_RETRIES} retries`);
        }
      });
  };

  return attempt(MAX_RETRIES);
});

Cypress.Commands.add(
  'shouldMatch',
  { prevSubject: true },
  (subject: any, reference: any, numberTolerance = 0.01) => {
    compareWithTolerance(subject, reference, numberTolerance);
  }
);


Cypress.Commands.add('fillSelect', (label: string, option: string) => {
  // Find button by label
  cy.contains('label', label)
    .invoke('attr', 'id')
    .then((labelId) => {
      cy.get(`button[aria-labelledby*="${labelId}"]`).click();
    });

  // Select option from listbox
  cy.get('[role="listbox"]')
    .contains('[role="option"]', option, { matchCase: false })
    .should('be.visible')
    .click();
});

Cypress.Commands.add('fillTypedSelect', (label: string, option: string) => {
  // Open dropdown
  cy.contains('label', label)
    .invoke('attr', 'id')
    .then((labelId) => {
      cy.get(`button[aria-labelledby*="${labelId}"]`).click();
    });

  // Type into searchbox if it exists
  cy.get('[role="listbox"]').within(() => {
    cy.get('input[type="text"]').type(option, { delay: 150 });
  });

  // Pick matching option
  cy.get('[role="listbox"]')
    .contains('[role="option"]', option, { matchCase: false })
    .should('be.visible')
    .click();
});



Cypress.Commands.add('resetAndSeed', () => {
  cy.task('db:resetAndSeed');
});

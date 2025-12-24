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
const storageBucket = 'flare-7091a.firebasestorage.app';
const storageEms = `http://127.0.0.1:9199/v0/b/${storageBucket}/o`;

// Helper Functions
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

function applyOobCode(oobCode: string) {
  return cy
    .request({
      method: 'POST',
      url: `${AUTH_EMULATOR}/accounts:update?key=${apiKey}`,
      body: { oobCode },
    })
    .then((response) => response.body);
}

Cypress.Commands.add('recivedOobCode', (email:string) => {
  getOobCode(email)
})

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
  cy.clearAuth();
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
    const newContains = 'CN Tower, Toronto';
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

Cypress.Commands.add(
  'userExists',
  (email: string, password: string, shouldExist: boolean = true) => {
    return cy.loginUser(email, password).then((resp) => {
      if (shouldExist) {
        expect(resp.body.localId).to.not.be.null;
        expect(resp.body.localId).to.not.be.undefined;
      } else {
        expect(resp.body.localId).to.be.null;
        expect(resp.body.localId).to.be.undefined;
      }
      return resp.body;
    });
  }
);

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



Cypress.Commands.add('waitForEmulators', () => {
  cy.waitForAuthEmulator();
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

Cypress.Commands.add('seedAuthEmulator', () => {
  const functionsUrl = `${Cypress.env('FUNCTIONS_URL')}/${Cypress.env('NEXT_PUBLIC_FIREBASE_PROJECT_ID')}/us-central1/seedAuthEmulator`;

  cy.request('POST', functionsUrl).then((response) => {
    cy.log(functionsUrl);
    cy.log(JSON.stringify(response.body));
    expect(response.status).to.eq(200);
    expect(response.body).to.have.property('success', true);
  });
});

Cypress.Commands.add('prismaFind', (table, where) => {
  return cy.task('prismaFind', { table, where });
});

Cypress.Commands.add('getStorageFile', (path: string) => {
  const encodedPath = encodeURIComponent(path);
  const url = `${storageEms}/${encodedPath}`;

  const MAX_RETRIES = 10; // same as your Firestore helper
  const DELAY_MS = 500;

  const attempt = (retryCount: number): Cypress.Chainable<any> => {
    return cy
      .request({
        method: 'GET',
        url,
        failOnStatusCode: false, // allow 404 on missing file
      })
      .then((resp) => {
        if (resp.status === 200) {
          return resp.body; // ✅ File metadata found
        } else if (retryCount > 0) {
          cy.wait(DELAY_MS);
          return attempt(retryCount - 1); // 🔁 retry
        } else {
          throw new Error(`Storage file "${path}" not found after ${MAX_RETRIES} retries`);
        }
      });
  };

  return attempt(MAX_RETRIES);
});


Cypress.Commands.add('waitForNextApi', (alias) => {
  return cy.wait(alias).then((interception) => {
    if (!interception.response) {
      throw new Error(`No response for ${alias}`);
    }
    return interception;
  });
});

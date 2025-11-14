import { createOrg } from '../../../cypress/support/constants/Organization';

function getOrgSignUpInputs() {
  return {
    submit: () => cy.contains('Submit'),
    orgName: () => cy.get("[data-cy='orgName-input']"),
    email: () => cy.get("[data-cy='email-input']"),
    location: () => cy.get("[data-cy='location-input']"),
    password: () => cy.get("[data-cy='password-input']"),
    confirmPassword: () => cy.get("[data-cy='confirmPassword-input']"),
    instagram: () => cy.get("[data-cy='instagram-input']"),
    facebook: () => cy.get("[data-cy='facebook-input']"),
    twitter: () => cy.get("[data-cy='twitter-input']"),
    otherProof: () => cy.get("[data-cy='other-input']"),
  };
}

function getOrgFileInputs() {
  return {
    instagram: () => cy.get("[data-cy='instagram-file-input']"),
  };
}

function getProofOfOwnershipInputs() {
  return cy
    .get('label')
    .filter((_, el) => el.textContent?.includes('Proof of Ownership') === true)
    .find('input');
}

function orgsignUpFillFiles() {
  const { instagram } = getOrgFileInputs();

  instagram().selectFile('cypress/fixtures/stockEvent.jpg', { force: true });
}

function orgSignUpFillForm(em?: string, pass?: string, confPass?: string, shouldSubmit?: boolean) {
  const {
    submit,
    orgName,
    email,
    password,
    confirmPassword,
    instagram,
    facebook,
    twitter,
    otherProof,
  } = getOrgSignUpInputs();

  if (shouldSubmit === undefined) {
    shouldSubmit = true;
  }


  orgName().type(createOrg.name);
  email().type(em ?? createOrg.email);
  cy.usePlacesInput("[data-cy='location-input']");
  password().type(pass ?? createOrg.password);
  confirmPassword().type(confPass ?? createOrg.password);
  instagram().type(createOrg.instagram);
  twitter().type(createOrg.twitter);
  facebook().type(createOrg.facebook);
  otherProof().type('other');
  shouldSubmit && submit().click({ force: true });
}

describe('check for page components', () => {
  beforeEach(() => {
    cy.visit('flare-signup');
  });

  it('tests that page compoents load', () => {
    getProofOfOwnershipInputs();
  });
});

describe('Org signup flow', () => {
  beforeEach(() => {
    cy.clearAllEmulators();
    cy.intercept('POST', '/api/auth/signUp').as('signup');
    //cy.intercept('DELETE', '/api/loginToken').as('deleteLoginToken');
    cy.intercept('GET', '/confirmation*').as('confirmationPage');
    cy.visit('/flare-signup');
    cy.clearForm();
  });

  it('Tests success flow', () => {
    orgSignUpFillForm();

    cy.window().should((win) => {
      expect(win.sessionStorage.getItem('manualLoginInProgress')).to.equal('true');
    });

    cy.waitForNextApi('@signup'); // POST
    //cy.waitForNextApi('@deleteLoginToken'); // DELETE
    cy.wait("@confirmationPage")
    cy.location('pathname', { timeout: 60000 }).should('eq', '/confirmation');
    cy.window().should((win) => {
      expect(win.sessionStorage.getItem('manualLoginInProgress')).to.be.null;
    });

    cy.contains('Thank You For Signing Up!', { timeout: 60000 }).should('be.visible');
    cy.userExists(createOrg.email, createOrg.password);
  });

  it('Ensures user info is added', () => {
    cy.prismaFind('user', { email: createOrg.email }).then((user) => {
      expect(user).not.to.be.null;
      expect(user.account_type).to.equal('org');
    });
  });
});

describe('Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.visit('/flare-signup');
    cy.clearAllEmulators();
    cy.clearForm();
  });

  it('Tests confirm password with different passwords', () => {
    const { password, confirmPassword } = getOrgSignUpInputs();
    password().type('password');
    confirmPassword().type('notpassword');
    cy.contains('Passwords Must Match');
  });

  it('tests that with different passwords form will be unsuccessful', () => {
    orgSignUpFillForm(undefined, 'password', 'notPassword');
    cy.contains('Successfully Submitted Application').should('not.exist');
    cy.url().should('include', '/flare-signup');
  });
});

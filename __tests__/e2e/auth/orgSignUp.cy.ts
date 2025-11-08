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
function getProofOfOwnershipInputs() {
  return cy
    .get('label')
    .filter((_, el) => el.textContent?.includes('Proof of Ownership') === true)
    .find('input');
}

function orgSignUpFillForm(em?: string, pass?: string, confPass?: string, shouldSubmit?: boolean) {
  const {
    submit,
    orgName,
    email,
    location,
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

describe('Page Components', () => {
  beforeEach(() => {
    cy.visit('/flare-signup');
    cy.clearForm();
  });

  it('Loads Form', () => {
    getProofOfOwnershipInputs()
      .should('have.length', 4)
      .each((input) => {
        cy.wrap(input).should('exist');
      });
    cy.checkExistance(getOrgSignUpInputs());
  });
});

describe('Success Flow', () => {
  before(() => {
    cy.visit('/flare-signup');
    cy.clearAllEmulators();
    cy.clearForm();
  });

  it('Successfully Submits Form', () => {
    cy.intercept('POST', '/api/loginToken').as('loginToken');
    cy.intercept('POST', '/api/auth/signUp').as('signup');
    cy.intercept('DELETE', '/api/loginToken').as('deleteLoginToken');
    cy.intercept('GET', '/confirmation*').as('confirmation');

    orgSignUpFillForm();

    cy.window({ timeout: 10000 }).should((win) => {
      expect(win.sessionStorage.getItem('manualLoginInProgress')).to.equal('true');
    });

    cy.wait('@loginToken');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.wait('@signup');
    cy.get('button[type="submit"]').should('not.be.disabled');
    cy.wait('@deleteLoginToken');

    cy.window({ timeout: 10000 }).should((win) => {
      expect(win.sessionStorage.getItem('manualLoginInProgress')).to.be.null;
    });
    cy.wait("@confirmation")

  });

  it('Ensures account exists', () => {
    cy.userExists(createOrg.email, createOrg.password);
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

  it('tests to ensure toast on not all form fields filled', () => {
    const { orgName, submit } = getOrgSignUpInputs();
    orgSignUpFillForm(undefined, undefined, undefined, false);
    orgName().clear();
    submit().click();
    cy.contains('Sign up error');
  });
});

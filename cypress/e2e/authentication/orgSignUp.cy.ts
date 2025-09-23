import { verifiedOrg } from '../../support/constants';

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
    .filter((_, el) => el.textContent?.includes('Proof of Ownership'))
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

  orgName().type(verifiedOrg.name);
  email().type(em ?? verifiedOrg.email);
  cy.usePlacesInput("[data-cy='location-input']");
  password().type(pass ?? verifiedOrg.password);
  confirmPassword().type(confPass ?? verifiedOrg.password);
  instagram().type(verifiedOrg.instagram);
  twitter().type(verifiedOrg.twitter);
  facebook().type(verifiedOrg.facebook);
  otherProof().type('other');
  shouldSubmit && submit().click({ force: true });
}

describe('Page Components', () => {
  beforeEach(() => {
    cy.visit('/flare-signin');
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

  it('Tests google maps location input', () => {
    cy.usePlacesInput(
      "[data-cy='location-input']",
      'two faces',
      'Two Faces, Wilson Street, Guelph, ON, Canada'
    );
  });
});

describe('Success Flow', () => {
  before(() => {
    cy.visit('/flare-signin');
    cy.clearAllEmulators();
    cy.clearForm();
  });

  it('Successfully Submits Form', () => {
    orgSignUpFillForm();
    cy.contains('Successfully Submitted Application');
    cy.location('pathname').should('eq', '/confirmation');
  });


  it("Ensures account exists", () => {
    cy.loginUser(verifiedOrg.email, verifiedOrg.password).then((resp) =>{
      cy.log(resp.body)
    })
  })

});

describe('Unsuccessful Flow', () => {
  beforeEach(() => {
    cy.visit('/flare-signin');
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
  });

  it('tests to ensure toast on not all form fields filled', () => {
    const { orgName, submit } = getOrgSignUpInputs();
    orgSignUpFillForm(undefined, undefined, undefined, false);
    orgName().clear();
    submit().click();
    cy.contains('Please fill out all required fields');
  });
});
